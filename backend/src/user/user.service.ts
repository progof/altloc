import {
  usersTable,
  adminsTable,
  googleAccountsTable,
  passwordAccountsTable,
} from "@db/schema.js";
import { z, ZodType } from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { HTTPError, dateToUTCTimestamp } from "@/utils.js";
import { User } from "@shared/index.js";
import { Transaction } from "@/db.js";
import { Database } from "@/utils.js";
import { config } from "@/config.js";
import sharp from "sharp";
import { s3 } from "@/s3.js";
// import multer from "multer";

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  avatarKey: z.string().nullable(),
  createdAt: z.number(),
  role: z.string(),
  score: z.number(),
  level: z.number(),
  currency: z.number(),
  isAdmin: z.boolean(),
  authMethods: z.array(z.union([z.literal("password"), z.literal("google")])),
}) satisfies ZodType<User>;

// export const UpdateCurrentUserBodySchema = z.object({
//   username: z.string().min(1).max(255).optional(),
//   avatar: z
//     .instanceof(File)
//     .refine((file) => file.size < 4 * 1024 * 1024, {
//       message: "The image is too large, max size is 4 MB",
//     })
//     .refine((file) => file.type.startsWith("image/"), {
//       message: "The file must be an image",
//     })
//     .optional(),
// });

// Update this to allow any file type coming from the browser input
export const UpdateCurrentUserBodySchema = z.object({
  username: z.string().min(1).max(255),
  avatar: z
    .any() // Allow any file type coming from the browser input
    .refine((file) => file.size < 4 * 1024 * 1024, {
      message: "The image is too large, max size is 4 MB",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "The file must be an image",
    })
    .optional(),
});

const createUserAvatarKey = () => `users/avatars/${crypto.randomUUID()}`;

const compressUserAvatar = (image: ArrayBuffer) => {
  return sharp(image)
    .resize({ width: 256, height: 256, fit: "cover" })
    .webp({ quality: 90 })
    .toBuffer();
};

const uploadUserAvatar = async (key: string, avatar: File) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: config.MINIO_BUCKET,
      Key: key,
      Body: await compressUserAvatar(await avatar.arrayBuffer()),
      ACL: "public-read",
      ContentType: avatar.type,
    })
  );
};

// const deleteUserAvatar = async (key: string) => {
//   await s3.send(
//     new DeleteObjectCommand({
//       Bucket: config.MINIO_BUCKET,
//       Key: key,
//     })
//   );
// };

export class UserService {
  constructor(private readonly db: Database | Transaction) {}

  async getUserById(userId: string): Promise<User> {
    const user = (
      await this.db
        .select()
        .from(usersTable)
        .leftJoin(adminsTable, eq(usersTable.email, adminsTable.email))
        .leftJoin(
          googleAccountsTable,
          eq(usersTable.id, googleAccountsTable.userId)
        )
        .leftJoin(
          passwordAccountsTable,
          eq(usersTable.id, passwordAccountsTable.userId)
        )
        .where(eq(usersTable.id, userId))
    ).at(0);

    if (!user) {
      throw new HTTPError({ status: 404, message: "User not found" });
    }

    return userSchema.parse({
      id: user.users.id,
      username: user.users.username,
      email: user.users.email,
      emailVerified: user.users.emailVerified,
      avatarKey: user.users.avatarKey,
      createdAt: dateToUTCTimestamp(user.users.createdAt),
      role: user.users.role,
      score: user.users.score,
      level: user.users.level,
      currency: user.users.currency,
      isAdmin: user.admins !== null,
      authMethods: [
        user.google_accounts ? "google" : null,
        user.password_accounts ? "password" : null,
      ].filter((method) => method !== null) as Array<"password" | "google">,
    } satisfies User);
  }

  async updateCurrentUser(
    _db: Database | Transaction,
    userId: string,
    body: z.infer<typeof UpdateCurrentUserBodySchema>
  ) {
    return this.db.transaction(async (tx: Transaction) => {
      const user = (
        await tx.select().from(usersTable).where(eq(usersTable.id, userId))
      ).at(0);
      if (!user) {
        throw new HTTPError({ status: 404, message: "User not found" });
      }

      // Update username if present
      if (body.username) {
        await tx
          .update(usersTable)
          .set({ username: body.username })
          .where(eq(usersTable.id, userId));
      }

      // Handle avatar upload if present
      if (body.avatar) {
        const avatarKey = createUserAvatarKey();
        try {
          // Upload the new avatar and update the avatar key in the database
          await Promise.all([
            uploadUserAvatar(avatarKey, body.avatar),
            tx
              .update(usersTable)
              .set({ avatarKey })
              .where(eq(usersTable.id, userId)),
          ]);
        } catch (error) {
          console.error("Error uploading avatar:", error);
          throw new HTTPError({
            status: 500,
            message: "Error uploading avatar",
          });
        }
      }
    });
  }
}
