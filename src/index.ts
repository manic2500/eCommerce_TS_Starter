import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { appConfig } from "./common/config";
import { NotFoundError } from "./common/exceptions/errors";
import { ErrorCode } from "./common/exceptions/errorCode";
import rootRouter from "./features/shared/routes";
import { errorMiddleware } from "./common/middlewares/error.middleware";
import { authMiddleware } from "./common/middlewares/auth.middleware";


const app = express();

const allowedOrigins = [
    'http://localhost:5173', // Your Vite development server
    appConfig.FRONTEND_URL // Your production frontend
];

const corsOptions: cors.CorsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, curl)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('❌ Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // ✅ Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
        'Authorization',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

/* 
const corsOptions: cors.CorsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies and authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type',
        'Accept', 'X-Access-Token', 'Authorization'] // Specify allowed headers
};

app.use(cors(corsOptions)); */

//enable pre-flight
app.options(/.*/, cors(corsOptions));

process.on('uncaughtException', (err) => {
    console.log(`ERROR: ${err}`);
    console.log('Shutting down server due to uncaught exception');
    process.exit(1)
})


app.use(cookieParser());

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Working 12345")
})

// A public route that does not require authentication
app.get('/api/public', (req, res) => {
    res.json({ message: 'This is a public route.' });
});

// A protected route that requires a valid JWT
app.get('/api/protected', authMiddleware, (req, res) => {
    // req.user is available here and is correctly typed
    res.json({ message: `Hello, user ${req.user?.userId}! This is protected data.` });
});


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
