import { Router } from "express";
import { CreateUserWithRolesSchema } from "./user.schema";
import { validateData } from "../../common/middlewares/validate.middleware";
import { registerUserHandler } from "./user.controller";

const userRoutes = Router()


userRoutes.post('/register', validateData(CreateUserWithRolesSchema), registerUserHandler)


export default userRoutes