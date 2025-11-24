import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes"; 
import { AppDataSource } from "./config/data-source";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

// Routes
app.use("/api", userRoutes);

app.get("/health", (req, res) => {
  res.json({ message: `Server is running on Port: ${PORT}` });
});

(async () => {
  try {
    await AppDataSource.initialize();
    console.log("📦 Database connected!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error during Data Source initialization:", error);
  }
})();
