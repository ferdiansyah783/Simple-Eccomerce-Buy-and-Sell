import app from "./app.js";
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

// UncaughtException Error
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});

const server = app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});
