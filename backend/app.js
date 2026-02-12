import express from "express";
import cors from "cors";
import userRoute from "./src/routes/user.route.js"
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use("/api/v1/users", userRoute)


export default app;