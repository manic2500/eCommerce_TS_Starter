import { Request, RequestHandler, Response } from "express";
import { LoginInput } from "./auth.schema";
import { authService } from "./auth.service";


export const loginHandler = async (req: Request<{}, {}, LoginInput>, res: Response) => {
    const { email, password } = req.body;

    // Delegate all business logic to the authService
    const { user, token } = await authService.login(email, password);

    // ✅ set HttpOnly cookie
    setAuthCookie({ res, name: 'token', value: token, });

    // Send the response with the user DTO and token
    return res.status(200).json({
        user,
        token,
    });

};

export const logoutHandler: RequestHandler = async (req, res) => {

    setAuthCookie({ res, name: 'token', value: '', maxAge: 0 });

    res.json({ message: 'Logged out successfully' });
}

export const me = async (req: Request, res: Response) => {
    res.json(req.user)
}


interface CookieOptions {
    res: Response;
    name: string;
    value: string;
    maxAge?: number; // in ms
    httpOnly?: boolean;
}

// 3600 * 1000 = default 1 hour    
function setAuthCookie({ res, name, value, maxAge = 3600 * 1000, httpOnly = true }: CookieOptions) {
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
