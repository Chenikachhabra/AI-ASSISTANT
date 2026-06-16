import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

//ES6 module syntax doesn't have __dirname, so we need to create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//initialize express app
const app = express();

//connect to database
connectDB();
//middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//routes

//404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    statusCode: 404,
  });
});

//Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(
    `Server running in  ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});
