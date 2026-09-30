import mongoose from "mongoose";

const mongodbUri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const databaseName = process.env.MONGODB_DB_NAME ?? "nodejs_security";

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(mongodbUri, { dbName: databaseName });

  if (mongoose.connection.db) {
    await mongoose.connection.db
      .createCollection("application_metadata")
      .catch((error: unknown) => {
        if (
          !(error instanceof Error) ||
          !error.message.toLowerCase().includes("already exists")
        ) {
          throw error;
        }
      });
  }

  console.log(`MongoDB connected to database "${databaseName}"`);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
