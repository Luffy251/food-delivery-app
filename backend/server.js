import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// DB connection
connectDB();

// API routes
app.use("/api/user", userRouter);

// Health check
app.get("/", (req, res) => {
    res.send("Food Delivery API is running!");
});

app.listen(port, () => {
    console.log(`🚀 Server started on http://localhost:${port}`);
});
