
import 'dotenv/config';

import { clerkMiddleware } from '@clerk/express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { initDB } from './config/db.js';
import { handleClerkWebhook } from './controller/webHookController.js';

const app = express();

// Server port
const PORT = process.env.PORT || 3001;

// Frontend allowed origins
const allowedOrigins = process.env.ORIGINS
    ? process.env.ORIGINS.split(',').map(origin => origin.trim())
    : [];

// 1. CORS configuration
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// 2. Clerk webhook route
// IMPORTANT: Keep this BEFORE express.json() and other body parsers.
app.post(
    '/api/clerk',
    express.raw({ type: 'application/json' }),
    handleClerkWebhook
);

// 3. Clerk authentication middleware
app.use(clerkMiddleware());

// 4. Cookie parser
app.use(cookieParser());

// 5. Parse normal JSON requests
app.use(express.json());

// 6. Test route
app.get('/', (req, res) => {
    res.status(200).send('ConnectMeet API is Live!');
});

// 7. Start server and connect database
const startServer = async () => {
    try {
        await initDB();

        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Database initialization failed:', error.message);
        process.exit(1);
    }
};

startServer();
