import express from "express";
import helmet from "helmet";
import cors from "cors";
import { mainRouter } from "./routes/main.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));
app.use(mainRouter);


export { app };