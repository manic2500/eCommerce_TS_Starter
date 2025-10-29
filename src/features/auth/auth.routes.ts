import { Router } from "express";
import { validateData } from "../../common/middlewares/validate.middleware";
import { LoginSchema } from "./auth.schema";
import { loginHandler, logoutHandler, me } from "./auth.controller";
import { authMiddleware } from "../../common/middlewares/auth.middleware";


const authRoutes = Router()

authRoutes.post("/login", validateData(LoginSchema), loginHandler);

authRoutes.post('/logout', logoutHandler);


authRoutes.get('/me', authMiddleware, me)

export default authRoutes