import express from "express";
import noteRoutes from "./routes/notesRoutes.js"
import authRoutes from "./routes/authRoutes.js"  // NEW: Import auth routes
import { connectdb } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
connectdb();

app.use(cors({
    origin: "http://localhost:5173",
}));

// Middleware = a function which run between request and response 
app.use(express.json()); // This will parse(allow) json bodies: req.body

app.use((req, res, next) => {
    console.log(`Req method is ${req.method} & Req url is ${req.url}`);
    next();
});

// Authentication routes
app.use("/api/auth", authRoutes);  // NEW: Auth routes at /api/auth

// Prefixing the /api/notes and string them in notesRoutes
app.use("/api/notes", noteRoutes);


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});


app.use((error, req, res, next) => {
    console.error("Error:", error);
    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

app.listen(PORT, () => {
    console.log("Server started at Port:", PORT);
});