import mongoose from 'mongoose';
import { config } from 'dotenv';
config({ path: './.env' });

export const connectDB = () => {
  mongoose.set('strictQuery', false);
  const connect = mongoose
    .connect(process.env.MONGODB_URL)
    .then((res) => {
      console.log('mongodb connected');
    })
    .catch((err) => {
      console.log('database error' + err);
    });
};
