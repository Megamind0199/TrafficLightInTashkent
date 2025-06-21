const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Atlasga muvaffaqiyatli ulanildi');
    } catch (err) {
        console.error('❌ MongoDB ulanishda xato:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;



