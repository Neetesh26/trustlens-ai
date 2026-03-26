import dotenv from "dotenv";
import { connectDB } from "./config/database";
import { createApp } from './app';
import { AppConfig } from "./utils/Appconfig";

dotenv.config();

const startServer = async (): Promise<void> => {
    try {
        await connectDB();
        const app = createApp();

        app.listen(AppConfig.PORT, () => {
            console.log(`✅ Server is running on port ${AppConfig.PORT}`);
            console.log(`🔧 Environment: ${AppConfig.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
