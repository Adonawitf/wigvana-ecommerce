import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wigvana';

async function listUsers() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`Connected to ${MONGO_URI}`);

        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        const data = users.map(u => ({
            email: u.email,
            id: u._id,
            roles: u.roles,
            createdAt: u.createdAt,
            accountStatus: u.accountStatus
        }));

        fs.writeFileSync('user_diagnostics.json', JSON.stringify(data, null, 2));
        console.log(`Saved ${data.length} users to user_diagnostics.json`);

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

listUsers();
