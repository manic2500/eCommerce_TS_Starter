import { Request, RequestHandler, Response } from "express";
import { setAuthCookie } from "../shared/utils";


export const logoutHandler: RequestHandler = async (req, res) => {

    setAuthCookie({ res, name: 'token', value: '', maxAge: 0 });

    res.json({ message: 'Logged out successfully' });
}

export const me = async (req: Request, res: Response) => {
    res.json(req.user)
}
