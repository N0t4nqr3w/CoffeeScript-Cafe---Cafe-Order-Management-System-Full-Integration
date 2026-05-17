import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import {router as ordersRoutes} from "./routes/orders.js";
import {router as menuItemsRoutes} from "./routes/menuItems.js";
import {router as userRoutes} from "./routes/users.js";
import {router as authRoutes} from "./routes/auth.js";

//Load config values
dotenv.config();

//Connect to MongoDB
const mongoDB = process.env.MONGODB_URI;
async function connectDB() {
    try {
        await mongoose.connect(mongoDB);
        console.log("mongoDB connected");
    } catch (err) {
        console.error("mongoDB not connected");
        process.exit(1);
    }
}
await connectDB();

//Create express app
const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

//Mount routes
app.use("/api/orders",ordersRoutes);
app.use("/api/menu", menuItemsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth",authRoutes);

//Error handling
app.use((err, req, res, next) => {
   res.status(500).json({ error: err.message });
});

//Set and connect to the port
const PORT = process.env.PORT || 3000;

app.listen(PORT,"0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Client available at http://localhost:${PORT}/index.html`);
    console.log(`CORS enabled for all origins (development mode)`);
});