import { Router } from "express";
import authRoutes from "../auth/auth.routes";
import userRoutes from "../user/user.route";
import productRoutes from "../product/product.routes";

const rootRouter = Router()

rootRouter.use('/', userRoutes)
rootRouter.use('/auth', authRoutes)
rootRouter.use('/products', productRoutes)

export default rootRouter