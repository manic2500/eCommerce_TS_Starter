import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import productData from './product-data'

async function main() {
    const prisma = new PrismaClient();
    await prisma.product.deleteMany();
    await prisma.product.createMany({
        data: productData.products
    })
    console.log('Products seeded successfully');
}

main()

// $ npx tsx ./src/common/prisma/seed-product.ts