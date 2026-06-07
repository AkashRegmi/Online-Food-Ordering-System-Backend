import mongoose from "mongoose";
export const connectDb = async (retries = 5) => {
  try {
    const databaseConnection = await mongoose.connect(process.env.MONGO_URL);
    console.log("Database is connected");
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying to connect to the database attempt no. ${retries}`);
      setTimeout(() => {
        connectDb(retries - 1);
      }, 5000);
    } else {
      console.log("All the retry Attempt Failed ");
      process.exit(1);
    }
  }
};
