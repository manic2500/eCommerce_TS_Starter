import { appConfig } from "../../common/config";
import prisma from "../../common/prisma/client";

class ProductService {

    async getLatestProducts() {
        const products = await prisma.product.findMany({
            take: appConfig.LATEST_PRODUCTS_LIMIT,
            orderBy: { createdAt: 'desc' }
        });
        return products
    }
    async getAllProducts() {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return products
    }
}

export const productService = new ProductService()