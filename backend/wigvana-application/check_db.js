import mongoose from 'mongoose';
import Product from './src/models/Product.model.js';
import User from './src/models/User.model.js';
import config from './src/config/index.js';
import fs from 'fs';

async function check() {
    let report = '';
    const log = (msg) => {
        console.log(msg);
        report += msg + '\n';
    };

    try {
        await mongoose.connect(config.MONGO_URI);
        log('Connected to DB');

        const products = await Product.find({});
        log(`Total products in DB: ${products.length}`);

        products.forEach(p => {
            log(`Product: ${p.name}, ID: ${p._id}, SellerID: ${p.sellerId}, Approval: ${p.approvalStatus}, Published: ${p.isPublished}`);
        });

        const users = await User.find({ roles: 'seller' });
        log(`Total sellers in DB: ${users.length}`);
        users.forEach(u => {
            log(`Seller: ${u.email}, ID: ${u._id}`);
        });

        fs.writeFileSync('db_results.txt', report);
        console.log('Results written to db_results.txt');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
