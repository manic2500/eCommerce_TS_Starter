import express from "express";
import { appConfig } from "./config";
import rootRouter from "./routes";
import { errorMiddleware } from "./middlewares/errors";
import { NotFoundError } from "./exceptions/errors";
import { ErrorCode } from "./exceptions/errorCode";


const app = express();

process.on('uncaughtException', (err) => {
    console.log(`ERROR: ${err}`);
    console.log('Shutting down server due to uncaught exception');
    process.exit(1)
})

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Working 12345")
})

app.use('/api', rootRouter)


// --- Place the 404 handler middleware AFTER all other routes ---
app.use((req, res, next) => {
    throw new NotFoundError('Invalid URL', ErrorCode.NOT_FOUND)
});

// Error handling middleware (optional)
app.use(errorMiddleware);


const server = app.listen(appConfig.PORT, () => {
    console.log(`Server is running on port ${appConfig.PORT}`);
})

// Handle Unhandled Promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`ERROR: ${err}`);
    console.log('Shutting down server due to unhandled promise rejection');
    server.close(() => {
        process.exit(1)
    })
})
