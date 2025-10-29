import { configDotenv } from "dotenv";

configDotenv({ path: '.env' })

export const appConfig = {
    PORT: process.env.PORT || '3000',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    LATEST_PRODUCTS_LIMIT: process.env.LATEST_PRODUCTS_LIMIT ? Number(process.env.LATEST_PRODUCTS_LIMIT) : 4,
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173"
}

