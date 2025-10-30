import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appConfig } from '../config';
import { ForbiddenError, UnauthorizedError } from '../types/exceptions/errors';
import { JwtPayload } from '../types/express';
import userService from '../../features/user/user.service';
import { getUserDto } from '../../features/shared/mappers/user.mapper';



// ✅ Ensure JWT secret is defined
const jwtSecret = appConfig.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET must be defined in your environment variables.');
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        // ✅ 1. Check Authorization header (for mobile / API requests)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
            console.log('🔐 Auth via Bearer header');
        }

        // ✅ 2. Fallback: check HttpOnly cookie (for web clients)
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
            console.log('🍪 Auth via cookie');
        }

        // ✅ 3. If no token found, reject
        if (!token) {
            throw new UnauthorizedError('No token provided.');
        }

        // ✅ 4. Verify JWT
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        // ✅ 5. Fetch user with roles and permissions from DB
        const userWithRoles = await userService.fetchUserWithRoles(decoded.userId)

        if (!userWithRoles) {
            throw new UnauthorizedError('User not found.');
        }

        // ✅ 6. Convert to DTO and attach to req.user
        const userDto = getUserDto(userWithRoles)

        req.user = {
            userId: userDto.id,
            roles: userDto.roles,
            permissions: userDto.permissions,
        };

        // ✅ 7. Continue to next middleware
        next();
    } catch (err) {
        // Handle specific JWT errors
        if (err instanceof jwt.TokenExpiredError) {
            throw new UnauthorizedError('Token expired.');
        }
        if (err instanceof jwt.JsonWebTokenError) {
            throw new ForbiddenError('Invalid token.');
        }

        // Generic fallback
        throw err
    }
};



/* 
// Read the JWT secret from your environment variables
const jwtSecret = appConfig.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET must be defined in your environment variables.');
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
    // 1. Get the 'Authorization' header from the request
    const authHeader = req.headers.authorization;

    // 2. Check if the header and token exist
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('No token provided.');
    }

    // 3. Extract the token from the header
    const token = authHeader.split(' ')[1];


    // 4. Verify the token
    try {
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        // 5. Attach the decoded user information to the request object
        const userWithRoles = await prisma.user.findFirst({
            where: { id: decoded.userId },
            include: { roles: { include: { permissions: true } } }
        })

        if (!userWithRoles) {
            throw new UnauthorizedError()
        }

        const user = userWithRoles.toDto();

        req.user = {
            userId: user.id,
            roles: user.roles,
            permissions: user.permissions
        };
        next();
    } catch (err) {
        // Handle specific JWT errors
        if (err instanceof jwt.JsonWebTokenError) {
            throw new ForbiddenError('Invalid token.');
        }
        if (err instanceof jwt.TokenExpiredError) {
            throw new UnauthorizedError('Token expired.');
        }
        // Handle any other verification errors
        throw new UnauthorizedError('Failed to authenticate token.');
    }
};
 */