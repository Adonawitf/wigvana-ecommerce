import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkCategories() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const categories = await db.collection('categories').find({}).toArray();
        console.log('Categories found:', categories.length);
        console.log('Categories:', JSON.stringify(categories, null, 2));
        await mongoose.connection.close();
    } catch (error) {
        console.error('Check failed:', error);
    }
}

checkCategories();
