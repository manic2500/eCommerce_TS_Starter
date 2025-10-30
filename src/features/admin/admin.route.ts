import { Router } from "express";
import { CreateUserWithRolesSchema } from "./admin.schema";
import { validateData } from "../../common/middlewares/validate.middleware";
import { createUserHandler } from "./admin.controller";

const adminRoutes = Router()


adminRoutes.post('/create-user', validateData(CreateUserWithRolesSchema), createUserHandler)


export default adminRoutes