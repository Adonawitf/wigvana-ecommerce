import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, './backend/wigvana-application/.env') });

async function diagnose() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const usersCount = await db.collection('users').countDocuments();
        const productsCount = await db.collection('products').countDocuments();
        const ordersCount = await db.collection('orders').countDocuments();

        console.log('Counts:', { usersCount, productsCount, ordersCount });

        const adminUser = await db.collection('users').findOne({ email: 'admin@wigvana.com' });
        console.log('Admin User Details:', adminUser);

        const recentUsers = await db.collection('users').find().sort({ createdAt: -1 }).limit(5).toArray();
        console.log('Recent Users IDs:', recentUsers.map(u => u._id));

        await mongoose.connection.close();
    } catch (error) {
        console.error('Diagnosis failed:', error);
    }
}

diagnose();
