import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../exceptions/errors';
import { AppPermission } from '../types/permission.enum';

type PermissionInput = AppPermission | AppPermission[];

export const requirePermission = (permission: PermissionInput) => {
    const requiredPermissions = Array.isArray(permission) ? permission : [permission];

    // Extract the resource from the permission string (e.g., 'product' from 'product:create')
    const getResourceAllPermission = (p: AppPermission): AppPermission => {
        const [resource] = p.split(':');
        return `${resource}:all` as AppPermission;
    };

    // Check if the required permission is covered by a broader 'all' permission
    const checkPermissions = (userPermissions: string[]): boolean => {
        for (const p of requiredPermissions) {
            if (userPermissions.includes(p)) {
                return true;
            }
            // Check for the resource:all permission
            const resourceAll = getResourceAllPermission(p);
            if (userPermissions.includes(resourceAll)) {
                return true;
            }
        }
        return false;
    };

    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user || !user.permissions) {
            return next(new ForbiddenError('You do not have the required permissions.'));
        }

        // Handle Super Admin role early
        if (user.permissions.includes(AppPermission.ALL)) {
            return next();
        }

        // Check if the user has the required permission(s) or a broader 'all' permission
        if (!checkPermissions(user.permissions)) {
            return next(new ForbiddenError('You do not have the required permissions.'));
        }

        next();
    };
};

/* 
export const requirePermission = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.permissions.includes(permission)) {
            return next(new ForbiddenError('You do not have the required permissions.'));
        }
        next();
    };
};

export const requireRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.roles.includes(role)) {
            return next(new ForbiddenError('You do not have the required role.'));
        }
        next();
    };
}; */