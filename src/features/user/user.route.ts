import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { logoutHandler, me } from "./user.controller";

const userRoutes = Router()

userRoutes.post('/logout', authMiddleware, logoutHandler);
userRoutes.get('/me', authMiddleware, me)
//userRoutes.patch('/change-password', auth, changePassword);

export default userRoutes