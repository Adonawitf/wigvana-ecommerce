import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

async function diagnose() {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const usersCount = await db.collection('users').countDocuments();
        const productsCount = await db.collection('products').countDocuments();
        const ordersCount = await db.collection('orders').countDocuments();

        console.log('Counts:', { usersCount, productsCount, ordersCount });

        const adminUser = await db.collection('users').findOne({ email: 'admin@wigvana.com' });
        console.log('Admin User Details:', adminUser);

        await mongoose.connection.close();
    } catch (error) {
        console.error('Diagnosis failed:', error);
    }
}

diagnose();
