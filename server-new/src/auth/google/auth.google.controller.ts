// src/auth/google/google.controller.ts
import { Router, Request, Response } from 'express';
import { generateState, generateCodeVerifier } from 'arctic';
import { google } from '@/oauth';
import { AuthGoogleService } from './auth.google.service';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export class AuthGoogleController {
    public readonly router = Router();

    constructor(
        private readonly authGoogleService: AuthGoogleService,

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
            return res.status(400).send('Invalid request');
        }

        try {
            const userId = await this.authGoogleService.handleGoogleCallback(code, codeVerifier);
            
            // Create JWT token
            const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });

            // Set the token as a cookie or send it in the response
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: 3600000, // 1 hour
            });

            res.redirect('/dashboard');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        } finally {
            res.clearCookie('google_oauth_state', { path: '/' });
            res.clearCookie('google_oauth_code_verifier', { path: '/' });
        }
    }


    // async handleGoogleCallback(req: Request, res: Response) {
    //     const code = req.query.code as string;
    //     const state = req.query.state as string;
    //     const storedState = req.cookies.google_oauth_state;
    //     const codeVerifier = req.cookies.google_oauth_code_verifier;
    
    //     if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    //         res.clearCookie('google_oauth_state', { path: '/' });
    //         res.clearCookie('google_oauth_code_verifier', { path: '/' });
    //         return res.status(400).send('Invalid request');
    //     }
    
    //     try {
    //         await this.authGoogleService.handleGoogleCallback(code, codeVerifier);
    //         res.clearCookie('google_oauth_state', { path: '/' });
    //         res.clearCookie('google_oauth_code_verifier', { path: '/' });
    //         res.redirect('/');
    //     } catch (error) {
    //         console.error(error);
    //         res.clearCookie('google_oauth_state', { path: '/' });
    //         res.clearCookie('google_oauth_code_verifier', { path: '/' });
    //         res.status(500).send('Internal Server Error');
    //     }
    // }
    
    
}
