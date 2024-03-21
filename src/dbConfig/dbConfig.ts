import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGODB_URI!);
  } catch (error) {
    console.log('Something went wrong');
    console.log(error);
  }
}