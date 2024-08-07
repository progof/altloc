import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "@/config";  
import { s3} from "@/s3";
import { google } from "@/oauth";


import { AuthPasswordService } from "./auth/password/auth.password.service";  
import { AuthPasswordController } from "./auth/password/auth.password.controller";

import { AuthGoogleService } from "./auth/google/auth.google.service";  
import { AuthGoogleController } from "./auth/google/auth.google.controller";
import { db } from "./db";




const app = express();

app.use(
    cors({
        origin: config.CLIENT_URL,
        credentials: true, 
    })
);
app.use(cookieParser());
app.use(express.json());

app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } 
    })
);

export const authPasswordService = new AuthPasswordService(config);
const authPasswordController = new AuthPasswordController(authPasswordService);
app.use(authPasswordController.router);

export const authGoogleService = new AuthGoogleService(s3, config.MINIO_BUCKET, google, db);
const authGoogleController = new AuthGoogleController(authGoogleService);
app.use(authGoogleController.router);

app.listen(config.APP_PORT, () => {
    console.log(`Server running on port: ${config.APP_PORT}`);
});
