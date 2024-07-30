import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";  


import { AuthPasswordService } from "./auth/password/auth.password.service";  
import { AuthPasswordController } from "./auth/password/auth.password.controller";

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

export const authPasswordService = new AuthPasswordService(config);
const authController = new AuthPasswordController(authPasswordService);
app.use(authController.router);

app.listen(config.APP_PORT, () => {
    console.log(`Server running on port: ${config.APP_PORT}`);
});
