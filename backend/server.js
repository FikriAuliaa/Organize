import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import eventRoute from "./routes/event.route.js";
import uploadRoute from "./routes/upload.route.js";
import { midtransNotification } from "./controllers/webhook.controller.js";

// Connect to database
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // Middleware untuk menerima body JSON

// Gunakan Rute
app.use("/api/users", userRoute);
app.use("/api/events", eventRoute);
app.use("/api/upload", uploadRoute);

app.post("/api/webhook/midtrans-notification", midtransNotification);
app.get("/api/webhook/midtrans-notification", (req, res) => {
  res.send("Webhook endpoint is active and reachable!");
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
