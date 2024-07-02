import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // try load environment variables

const uri: string = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;
const serverDb = async () => {
  await mongoose.connect(uri);
  console.log("DB connected.");
};

export default serverDb;
