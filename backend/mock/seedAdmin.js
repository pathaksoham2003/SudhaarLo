import User from '../models/User.js';
import { connectDB, mongoose } from '../utils/db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../env/.env.development') });

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminPhone = '1111111111';
        let admin = await User.findOne({ phone: adminPhone });

        if (!admin) {
            admin = await User.create({
                name: 'Mock Admin',
                phone: adminPhone,
                role: 'ADMIN',
                verified: true,
                profile_completed: true,
            });
            console.log('Mock Admin user created successfully.');
        } else {
            admin.role = 'ADMIN';
            admin.verified = true;
            admin.profile_completed = true;
            await admin.save();
            console.log('Mock Admin user already existed, updated properties.');
        }

        console.log('Seeding complete.');
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedAdmin();
