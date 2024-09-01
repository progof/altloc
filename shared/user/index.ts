export type User = {
    id: string;
    username: string;
    email: string;
    emailVerified: boolean;
    avatarKey: string | null;
    role: string;
    createdAt: Date;
  };