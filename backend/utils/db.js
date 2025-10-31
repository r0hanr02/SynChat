import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDb Connected`);
  } catch (error) {
    console.log("❌ Connection Failed", error);
    process.exit(1);
  }
};

export default connectDB;
