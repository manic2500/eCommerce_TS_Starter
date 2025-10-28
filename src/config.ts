import { configDotenv } from "dotenv";

configDotenv({ path: '.env' })

export const appConfig = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
}

