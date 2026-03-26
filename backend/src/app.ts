import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { requestLoggerGlobal } from './middlewares/requestLogger';
// import authRoutes from "./routes/auth.routes";
// import scanRoutes from "./routes/scan.routes";
import { generalLimiter } from "./middlewares/rateLimiter.middleware";
import router from "./routes/index.route";
// import { limiter } from "./middlewares/rateLimiter.middleware";



export const createApp = () => {
    const app = express();
    app.use(express.json({ limit: '10kb' }));        // Limit body size (DoS protection)
    app.use(express.urlencoded({ extended: true }));
    // app.use(cookieParser());
    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(requestLoggerGlobal)
    app.use(morgan("dev"));

    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    // app.use(limiter)

    app.use('/api', generalLimiter);
    // app.use("/api/auth", authRoutes);

    // app.use("/api/scan", scanRoutes);
    app.use('/api/v1', router);

    // app.get('/health', (_req, res) => {
    //   res.json({ status: 'ok', environment: env.NODE_ENV });
    // });

    app.use((_req, res) => {
        res.status(404).json({ success: false, message: 'Route not found' });
    });



    return app;
};









