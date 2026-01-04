import "dotenv/config";
import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var __mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.__mongoose;

if (!cached) {
  cached = global.__mongoose = {
    conn: null,
    promise: null,
  };
}

const connectToDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_CONNECT!)
      .then((mongoose) => {
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export { connectToDB };
