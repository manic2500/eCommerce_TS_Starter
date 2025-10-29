import { Request } from 'express';
import { User } from '../../../generated/prisma/client';
import { UserDto } from '../user.dto';


export interface JwtPayload {
    userId: string;
    roles: string[];
    permissions: string[];
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

/* import express from 'express'
declare module 'express'{
    export interface Request{
        user: User
    }
} */