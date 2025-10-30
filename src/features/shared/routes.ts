import { Router } from "express";
import publicRoutes from "../public/public.routes";
import userRoutes from "../user/user.route";
import productRoutes from "../product/product.routes";
import adminRoutes from "../admin/admin.route";

const rootRouter = Router()

rootRouter.use('/', publicRoutes)
rootRouter.use('/admin', adminRoutes)
rootRouter.use('/user', userRoutes)
rootRouter.use('/products', productRoutes)

export default rootRouter