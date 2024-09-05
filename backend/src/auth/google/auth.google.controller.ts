import { Router, Request, Response } from 'express';
import { generateState, generateCodeVerifier } from 'arctic';
import { google } from '@/oauth';
import { AuthGoogleService } from './auth.google.service';
import { AuthPasswordService } from "@/auth/password/auth.password.service";


export class AuthGoogleController {
    public readonly router = Router();

    constructor(
        private readonly authGoogleService: AuthGoogleService,
        private readonly authPasswordService: AuthPasswordService,
    ) {
        this.router.get('/auth/google', this.userRegisterWithGoogle.bind(this));
        this.router.get('/auth/google/callback', this.handleGoogleCallback.bind(this));
    }

    async userRegisterWithGoogle(req: Request, res: Response) {
        const state = generateState();
        const codeVerifier = generateCodeVerifier();
        const url = await google.createAuthorizationURL(state, codeVerifier, {
            scopes: ["email", "profile"],
        });

        res.cookie('google_oauth_state', state, {
            path: '/',
            httpOnly: true,
            maxAge: 600000, // 10 min
            sameSite: 'lax',
        });

        res.cookie('google_oauth_code_verifier', codeVerifier, {
            path: '/',
            httpOnly: true,
            maxAge: 600000, // 10 min
            sameSite: 'lax',
        });

        res.redirect(url.toString());
    }

    async handleGoogleCallback(req: Request, res: Response) {
        const code = req.query.code as string;
        const state = req.query.state as string;
        const storedState = req.cookies.google_oauth_state;
        const codeVerifier = req.cookies.google_oauth_code_verifier;

        if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
            res.clearCookie('google_oauth_state', { path: '/', httpOnly: true });
            res.clearCookie('google_oauth_code_verifier', { path: '/', httpOnly: true });
            return res.status(400).send('Invalid request');
        }

        try {
            // Получение информации о пользователе через Google OAuth
            const userId = await this.authGoogleService.handleGoogleCallback(code, codeVerifier);

            // Создание сессии для пользователя
            const user = await this.authPasswordService.getUserById(userId);
            if (!user) {
                throw new Error("User not found after Google authentication");
            }

            const session = await this.authPasswordService.createSession(user.id, user.role);

            // Генерация access и refresh токенов
            const accessToken = this.authPasswordService.generateAccessToken({
                userId: user.id,
                role: user.role,
            });

            const refreshToken = this.authPasswordService.generateRefreshToken({
                userId: user.id,
                sessionId: session.sessionId,
                role: user.role,
            });

            // Установка токенов в куки
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                maxAge: 3600000, // 1 hour
            });

            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                maxAge: 604800000, // 7 days
            });

            // Сохранение пользователя в сессии
            req.session.user = user;

            // Очистка временных cookies и редирект
            res.clearCookie('google_oauth_state', { path: '/', httpOnly: true });
            res.clearCookie('google_oauth_code_verifier', { path: '/', httpOnly: true });
            
            res.redirect('/user/day-quest');
        } catch (error) {
            console.error(error);

            res.clearCookie('google_oauth_state', { path: '/', httpOnly: true });
            res.clearCookie('google_oauth_code_verifier', { path: '/', httpOnly: true });

            return res.status(500).send('Internal Server Error');
        }
    }
}
