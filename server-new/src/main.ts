import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";  


import { AuthService } from "./auth/auth.service";  
import { AuthController } from "./auth/auth.controller";

const app = express();

app.use(cors());
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

export const authService = new AuthService(config);
const authController = new AuthController(authService);
app.use(authController.router);

app.listen(config.APP_PORT, () => {
    console.log(`Server running on port ${config.APP_PORT}`);
});
