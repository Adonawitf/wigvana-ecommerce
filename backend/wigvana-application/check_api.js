import mongoose from 'mongoose';
import { productService } from './src/services/product.service.js';
import config from './src/config/index.js';
import fs from 'fs';

async function run() {
    await mongoose.connect(config.MONGO_URI);
    const result = await productService.listProducts({ page: 1, limit: 1 });
    fs.writeFileSync('api_response_sample.json', JSON.stringify(result, null, 2));
    console.log('API response sample saved');
    process.exit(0);
}
run();
