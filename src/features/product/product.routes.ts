import { Router } from 'express';

//import { requirePermission } from '../../common/middlewares/permission.middleware';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { requirePermission } from '../../common/middlewares/permission.middleware';
import AppPermission from '../../common/types/constants/appPermission';
import { getAllProducts, getLatestProducts } from './product.controller';


const productRoutes = Router();

// Route to get a list of products (requires 'product:read' permission)
productRoutes.get('/', authMiddleware, requirePermission(AppPermission.PRODUCT_READ), getAllProducts);
productRoutes.get('/latest',
    authMiddleware,
    requirePermission(AppPermission.PRODUCT_READ),
    getLatestProducts
);

// Route to create a new product (requires 'product:create' permission)
productRoutes.post('/', authMiddleware, requirePermission(AppPermission.PRODUCT_CREATE),
    (req, res) => {
        // ... logic to create a new product
        res.status(201).json({ message: 'Product created' });
    }
);

export default productRoutes;
