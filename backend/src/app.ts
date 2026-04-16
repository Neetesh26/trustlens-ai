import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { requestLoggerGlobal } from './middlewares/requestLogger';
import { generalLimiter } from "./middlewares/rateLimiter.middleware";
import router from "./routes/index.route";



export const createApp = () => {
    const app = express();
    app.use(express.json({ limit: '10kb' }));        // Limit body size (DoS protection)
    app.use(express.urlencoded({ extended: true }));
    // app.use(cookieParser());
    app.use(helmet());
    app.use(express.json());
    app.use(requestLoggerGlobal)
    app.use(morgan("dev"));

    app.use(
        cors({
            origin: (origin, callback) => {
                if (!origin) {
                    return callback(null, true);
                }

                const allowedOrigins = [
                    "http://localhost:5173",
                ];

                if (
                    allowedOrigins.includes(origin) ||
                    origin.startsWith("chrome-extension://")
                ) {
                    return callback(null, true);
                }

                callback(new Error("Not allowed by CORS"));
            },
            credentials: true,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
        })
    );

    app.use('/api', generalLimiter);

    app.use('/api/v1', router);


    app.use((_req, res) => {
        res.status(404).json({ success: false, message: 'Route not found' });
    });



    return app;
};









