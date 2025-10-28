// src/utils/jwt.ts
import jwt, { Secret } from "jsonwebtoken";
import { appConfig } from "../config";

interface JwtPayload {
    userId: number;
    email: string;
}

export const signToken = (payload: JwtPayload): string => {
    // 1. Check for the secret and throw an error if it's missing (runtime safety)
    /* if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not set in environment");
    } */
    if (!appConfig.JWT_SECRET) {
        throw new Error("JWT_SECRET is not set in environment");
    }

    const expiresInValue: string | number = appConfig.JWT_EXPIRES_IN || "1h";

    return jwt.sign(payload, appConfig.JWT_SECRET, {
        expiresIn: expiresInValue,
    } as jwt.SignOptions);
};
