import mongoose from "mongoose";

// 1️⃣ Mongo URI from environment
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in .env.local or production env");
}

// 2️⃣ Extend NodeJS global to cache connection (hot reload safe)
declare global {
  var mongoose: {
    conn: typeof import("mongoose") | null;
    promise: Promise<typeof import("mongoose")> | null;
  };
}


// 3️⃣ Cache object
const cached = global.mongoose ?? { conn: null, promise: null };

// 4️⃣ Connect function
export async function connectDB(): Promise<typeof mongoose> {
  // If already connected, return cached connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If not, create new connection promise
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,       // prevents buffering during connection issues
    //   useNewUrlParser: true,    // optional
    //   useUnifiedTopology: true, // optional
    });
  }

  // Await connection
  cached.conn = await cached.promise;

  // Save cached globally for hot reload
  global.mongoose = cached;

  console.log("✅ MongoDB connected");
  return cached.conn;
}
