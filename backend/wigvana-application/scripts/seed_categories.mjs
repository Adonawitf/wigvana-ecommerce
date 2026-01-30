import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../src/models/Category.model.js';

dotenv.config();

const categories = [
    {
        name: 'Synthetic Wigs',
        slug: 'synthetic-wigs',
        description: 'Affordable and low-maintenance synthetic hair wigs.',
        isActive: true,
        displayOrder: 1
    },
    {
        name: 'Human Hair Wigs',
        slug: 'human-hair-wigs',
        description: 'Premium quality 100% human hair wigs for the most natural look.',
        isActive: true,
        displayOrder: 2
    },
    {
        name: 'Lace Front Wigs',
        slug: 'lace-front-wigs',
        description: 'Wigs with a sheer lace front for a natural-looking hairline.',
        isActive: true,
        displayOrder: 3
    },
    {
        name: 'Full Lace Wigs',
        slug: 'full-lace-wigs',
        description: 'Versatile wigs with a full lace base for multiple styling options.',
        isActive: true,
        displayOrder: 4
    },
    {
        name: 'Headband Wigs',
        slug: 'headband-wigs',
        description: 'Easy-to-wear wigs with an attached headband.',
        isActive: true,
        displayOrder: 5
    },
    {
        name: 'Wig Care & Accessories',
        slug: 'wig-care-accessories',
        description: 'Products to maintain and style your wigs.',
        isActive: true,
        displayOrder: 6
    }
];

async function seedCategories() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if categories already exist
        const result = await Category.find({});
        if (result.length > 0) {
            console.log('Categories already exist, skipping seed.');
        } else {
            await Category.insertMany(categories);
            console.log('Successfully seeded categories!');
        }

        await mongoose.connection.close();
        console.log('Connection closed');
    } catch (error) {
        console.error('Seeding failed:', error);
    }
}

seedCategories();
