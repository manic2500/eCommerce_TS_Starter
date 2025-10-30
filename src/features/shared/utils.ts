import { Response } from "express";
import { UserWithRoles } from "./types/user";
import { UserDto } from "../../common/types/user.dto";


export interface CookieOptions {
    res: Response;
    name: string;
    value: string;
    maxAge?: number; // in ms
    httpOnly?: boolean;
}

// 3600 * 1000 = default 1 hour    
export function setAuthCookie({ res, name, value, maxAge = 3600 * 1000, httpOnly = true }: CookieOptions) {
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie(name, value, {
        httpOnly,
        secure: isProd,                     // HTTPS only in prod
        sameSite: isProd ? 'none' : 'lax', // None in prod for cross-origin, lax for dev
        maxAge,
    });

}








/* For local development:

    sameSite: 'lax'  // allows cross-origin fetches in dev across different ports
    secure: false    // no HTTPS needed


    For production (different domains):

    sameSite: 'none'  // required for cross-domain cookies
    secure: true      // HTTPS required 
*/