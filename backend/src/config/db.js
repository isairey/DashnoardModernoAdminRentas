const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1}/${retries} failed: ${error.message}`);
      
      if (error.message.includes('whitelist')) {
        console.error('\n⚠️  IP WHITELIST ERROR ⚠️');
        console.error('Your MongoDB Atlas cluster is blocking this IP address.');
        console.error('To fix this:');
        console.error('1. Go to https://cloud.mongodb.com');
        console.error('2. Navigate to Network Access (under Security)');
        console.error('3. Click "ADD IP ADDRESS"');
        console.error('4. Click "ALLOW ACCESS FROM ANYWHERE" (adds 0.0.0.0/0)');
        console.error('5. Wait 1-2 minutes and restart this service\n');
      }
      
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('All connection attempts failed. Exiting...');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
