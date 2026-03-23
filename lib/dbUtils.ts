import mongoose from 'mongoose';
import connectToDatabase from './mongodb';

/**
 * Ensures database is connected and ready before proceeding
 * This replaces the silent readyState checks throughout the codebase
 */
export async function ensureDatabaseConnection(): Promise<boolean> {
    try {
        const connection = await connectToDatabase();
        if (!connection) {
            console.error('❌ Database connection failed - MONGODB_URI not defined');
            return false;
        }

        // Wait for connection to be fully established
        if (mongoose.connection.readyState !== 1) {
            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Database connection timeout'));
                }, 5000);

                const checkConnection = () => {
                    if (mongoose.connection.readyState === 1) {
                        clearTimeout(timeout);
                        resolve();
                    } else if (mongoose.connection.readyState === 2) {
                        // Still connecting, check again
                        setTimeout(checkConnection, 100);
                    } else {
                        clearTimeout(timeout);
                        reject(new Error(`Database connection failed with state: ${mongoose.connection.readyState}`));
                    }
                };

                checkConnection();
            });
        }

        return true;
    } catch (error) {
        console.error('❌ Database connection error:', error);
        return false;
    }
}

/**
 * Wrapper for database operations with proper error handling
 */
export async function withDatabase<T>(
    operation: () => Promise<T>,
    fallbackValue: T
): Promise<T> {
    try {
        const isConnected = await ensureDatabaseConnection();
        if (!isConnected) {
            console.warn('⚠️ Database not available, returning fallback');
            return fallbackValue;
        }

        return await operation();
    } catch (error) {
        console.error('❌ Database operation failed:', error);
        return fallbackValue;
    }
}
