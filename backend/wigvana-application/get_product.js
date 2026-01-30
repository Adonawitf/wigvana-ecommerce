import mongoose from 'mongoose';
import Product from './src/models/Product.model.js';
import config from './src/config/index.js';
import fs from 'fs';

async function run() {
    await mongoose.connect(config.MONGO_URI);
    const p = await Product.findOne().lean();
    fs.writeFileSync('product_sample.json', JSON.stringify(p, null, 2));
    console.log('Product sample saved to product_sample.json');
    process.exit(0);
}
run();
