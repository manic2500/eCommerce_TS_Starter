import { Request, RequestHandler, Response } from "express";
import { compareSync, hashSync } from "bcrypt";
import prisma from "../prisma";
import { CreateUserInput, LoginInput } from "../schema/auth.schema";
import { signToken } from "../utils/jwt";
import { ConflictError, UnauthorizedError } from "../exceptions/errors";
import { ErrorCode } from "../exceptions/errorCode";



export const loginHandler = async (
    req: Request<{}, {}, LoginInput>,
    res: Response
) => {
    const { email, password } = req.body;


    // 1️⃣ Find user by email
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new UnauthorizedError("Invalid email or password")
        //return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2️⃣ Compare passwords
    const passwordMatches = compareSync(password, user.password);
    if (!passwordMatches) {
        throw new UnauthorizedError("Invalid email or password")
        //return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3️⃣ Generate JWT token
    const token = signToken({ userId: user.id, email: user.email });

    // 4️⃣ Return token + user info (omit password)
    const { password: _pwd, createdAt, updatedAt, ...userWithoutSensitive } = user;

    return res.status(200).json({
        token,
        user: userWithoutSensitive,
    });


};

export const signUpHandler = async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response
) => {
    const { email, name, password } = req.body

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
        //return res.status(409).json({ message: "Email already in use" });
        throw new ConflictError("Email already in use", ErrorCode.USER_ALREADY_EXISTS)
    }

    // Create new user
    const user = await prisma.user.create({
        data: { email, name, password: hashSync(password, 10) }
    });

    res.status(201).json(user);

};
