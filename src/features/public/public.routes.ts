import { Router } from "express";
import { validateData } from "../../common/middlewares/validate.middleware";
import { LoginSchema, RegisterUserSchema } from "./public.schema";
import { loginHandler, registerUserHandler } from "./public.controller";

const publicRoutes = Router()

publicRoutes.post('/register', validateData(RegisterUserSchema), registerUserHandler)
publicRoutes.post("/login", validateData(LoginSchema), loginHandler);
//router.post('/forgot-password', forgotPassword);
//router.post('/reset-password', resetPassword);

export default publicRoutes