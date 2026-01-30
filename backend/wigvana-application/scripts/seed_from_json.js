import mongoose from 'mongoose';
import Product from '../src/models/Product.model.js';
import ProductImage from '../src/models/ProductImage.model.js';
import Category from '../src/models/Category.model.js';
import User from '../src/models/User.model.js';
import config from '../src/config/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(config.MONGO_URI);
        console.log('Connected.');

        // 1. Find Admin User to own these products
        const admin = await User.findOne({ roles: 'admin' });
        if (!admin) {
            console.error('No admin user found. Please create an admin user first.');
            process.exit(1);
        }
        const adminId = admin._id;
        console.log(`Products will be owned by admin: ${admin.email} (${adminId})`);

        // 2. Read products.json
        const productsJsonPath = path.resolve(__dirname, './data/products.json');
        if (!fs.existsSync(productsJsonPath)) {
            console.error(`products.json not found at ${productsJsonPath}`);
            process.exit(1);
        }
        const { products } = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
        console.log(`Found ${products.length} products in JSON.`);

        // 3. Clear existing mock data (optional but recommended for clean seed)
        // We only clear products owned by the admin to avoid deleting real seller data
        // await Product.deleteMany({ sellerId: adminId });
        // await ProductImage.deleteMany({ productId: { $in: (await Product.find({ sellerId: adminId })).map(p => p._id) } });

        for (const item of products) {
            // 4. Ensure Category exists
            let category = await Category.findOne({ name: item.category });
            if (!category) {
                const slug = item.category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                category = await Category.create({
                    name: item.category,
                    slug,
                    isActive: true
                });
                console.log(`Created category: ${item.category}`);
            }

            // 5. Create Product
            // Check if product already exists by slug to avoid duplicates
            const slug = item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            let product = await Product.findOne({ slug });

            if (!product) {
                product = await Product.create({
                    name: item.name,
                    slug,
                    description: item.description,
                    basePrice: item.price,
                    currency: 'ETB',
                    categoryId: category._id,
                    sellerId: adminId,
                    stockQuantity: item.stock || 0,
                    averageRating: item.rating || 0,
                    reviewCount: item.reviewCount || 0,
                    availableColors: item.availableColors || [],
                    availableLengths: item.availableLengths || [],
                    isPublished: true,
                    approvalStatus: 'approved'
                });
                console.log(`Created product: ${item.name}`);

                // 6. Create ProductImage
                if (item.image) {
                    await ProductImage.create({
                        productId: product._id,
                        imageUrl: item.image, // e.g. "/images/img1.jpg"
                        altText: item.name,
                        isCover: true,
                        displayOrder: 0
                    });
                    console.log(`  Linked image: ${item.image}`);
                }
            } else {
                console.log(`Product already exists: ${item.name} (skipped)`);
            }
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

run();
