import cors from "cors";
import express from "express";
import authRouter from "./routes/auth.routes";
import healthRouter from "./routes/health.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_request, response) => {
  response.json({ message: "Node.js Security API is running" });
});

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);

export default app;
