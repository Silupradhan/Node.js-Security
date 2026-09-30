import "dotenv/config";
import app from "./app";
import { connectDatabase, disconnectDatabase } from "./config/database";

const port = Number(process.env.PORT ?? 5000);

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    const server = app.listen(port, () => {
      console.log(`API server listening on http://localhost:${port}`);
    });

    const shutdown = async (signal: string): Promise<void> => {
      console.log(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => void shutdown("SIGINT"));
    process.on("SIGTERM", () => void shutdown("SIGTERM"));
  } catch (error) {
    console.error("Unable to start the server:", error);
    process.exit(1);
  }
}

void startServer();
