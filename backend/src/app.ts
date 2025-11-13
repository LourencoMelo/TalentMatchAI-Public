import express, { Request, Response, response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import mongoose from "mongoose";
import routes from "./routes/routes";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

// MONGO DB STRING CONNECTION
const MONGO_URI = process.env.DATABASE_URL || "";

try {
  mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB Altas!");
} catch (error) {
  console.log("Failed to connect to MongoDB Atlas:");
  console.log(error);
}

export const app = express();
const PORT = process.env.BACKEND_PORT;

app.use(cors());
app.use(express.json());
// This is the default port used for olamma
app.use(
  "/api/generate",
  createProxyMiddleware({
    target: "http://localhost:11434",
    changeOrigin: true,
  })
);
app.listen(PORT, () => {});

routes(app);
