// src/auth/google/google.services.ts
import { FetchError } from '@/utils';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { googleAccountsTable, usersTable } from '@db/schema';
import { Database, Transaction, HTTPError } from '@/utils';
import { OAuth2RequestError, Google } from 'arctic';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import crypto from 'crypto';

const createUserAvatarKey = () => `users/avatars/${crypto.randomUUID()}`;

const googleUserInfoSchema = z.object({
    sub: z.string(),
    name: z.string(),
    picture: z.string().url().optional(),
    email: z.string().email(),
    email_verified: z.boolean().optional(),
    locale: z.string().optional(),
});

type GoogleUserInfo = z.infer<typeof googleUserInfoSchema>;

async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        throw new FetchError(res);
    }

    return googleUserInfoSchema.parse(await res.json());
}

export class AuthGoogleService {
    constructor(
        private readonly s3Client: S3Client,
        private readonly s3Bucket: string,
        private readonly google: Google,
        private readonly db: Database
    ) {}

    public async handleGoogleCallback(code: string, codeVerifier: string): Promise<string> {
        const tokens = await this.google.validateAuthorizationCode(code, codeVerifier).catch((error) => {
            if (error instanceof OAuth2RequestError && error.message === 'bad_verification_code') {
                throw new HTTPError({ status: 400 });
            }
            throw error;
        });

        const googleUser = await getGoogleUserInfo(tokens.accessToken);

        const userId = await this.processGoogleUser(googleUser);
        return userId;
    }

    private async processGoogleUser(googleUser: GoogleUserInfo): Promise<string> {
        return this.db.transaction(async (tx: Transaction) => {
            const existingUsers = await tx.select().from(usersTable).where(eq(usersTable.email, googleUser.email));
            const existingUser = existingUsers[0];

            if (existingUser) {
                const googleAccounts = await tx.select().from(googleAccountsTable).where(eq(googleAccountsTable.googleId, googleUser.sub));
                const googleAccount = googleAccounts[0];
                if (googleAccount) {
                    return existingUser.id;
                } else {
                    const avatarKey = existingUser.avatarKey ?? createUserAvatarKey();
                    await Promise.all([
                        !existingUser.avatarKey && googleUser.picture ? this.putUserAvatarFromUrl(googleUser.picture, avatarKey) : null,
                        tx.update(usersTable).set({
                            avatarKey,
                            emailVerified: googleUser.email_verified === true ? true : undefined,
                        }).where(eq(usersTable.id, existingUser.id)),
                        tx.insert(googleAccountsTable).values({
                            googleId: googleUser.sub,
                            userId: existingUser.id,
                        }),
                    ]);
                    return existingUser.id;
                }
            } else {
                const avatarKey = createUserAvatarKey();
                const userId = crypto.randomUUID();
                await tx.insert(usersTable).values({
                    id: userId,
                    email: googleUser.email,
                    emailVerified: googleUser.email_verified,
                    username: googleUser.name,
                    avatarKey,
                    role: 'user',
                    createdAt: new Date(),
                });
                await tx.insert(googleAccountsTable).values({
                    googleId: googleUser.sub,
                    userId,
                });
                return userId;
            }
        });
    }

    private async putUserAvatarFromUrl(pictureUrl: string, avatarKey: string): Promise<void> {
        const res = await fetch(pictureUrl);
        if (!res.ok) {
            throw new FetchError(res);
        }

        const contentType = res.headers.get('Content-Type');
        if (!contentType) {
            throw new Error('Failed to get content type');
        }

        await this.s3Client.send(new PutObjectCommand({
            Bucket: this.s3Bucket,
            Key: avatarKey,
            Body: Buffer.from(await res.arrayBuffer()),
            ACL: 'public-read',
            ContentType: contentType,
        }));
    }
}
