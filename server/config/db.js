const mongoose = require("mongoose"); 

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return; 

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGO_URI environment variable is not defined");
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("MongoDB connected");    
  } catch (error) {
    console.error('Error connecting MongoDB', error); 
    process.exit(1);
  }
}

module.exports = connectDB;