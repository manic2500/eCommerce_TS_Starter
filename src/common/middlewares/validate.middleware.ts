import z, { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import { UnprocessableEntityError } from "../exceptions/errors";


export const validateData = <T extends ZodType>(schema: T) => {
    return (req: Request<{}, {}, z.infer<T>>, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const formattedErrors = result.error.issues.map(issue => ({
                field: issue.path.join(".") || "body",
                message: issue.message
            }));
            throw new UnprocessableEntityError(formattedErrors)
        }

        req.body = result.data;
        next();
    };
};
