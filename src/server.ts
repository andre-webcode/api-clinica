import express from "express";
import helmet from "helmet";
import cors from "cors";
import { mainRouter } from "./routes/main.js";

const server = express();
const PORT = 3000;

server.use(express.json());
server.use(helmet());
server.use(cors());

server.use(mainRouter);


server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})