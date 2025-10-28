import { Router } from "express";
import { loginHandler, signUpHandler } from "../controllers/auth";
import { validateData } from "../middlewares/validate";
import { CreateUserSchema, LoginSchema } from "../schema/auth.schema";

const authRoutes = Router()


authRoutes.post('/signup', validateData(CreateUserSchema), signUpHandler)
authRoutes.post("/login", validateData(LoginSchema), loginHandler);


export default authRoutes