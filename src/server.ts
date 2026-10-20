import express from "express";
import helmet from "helmet";
import cors from "cors";

const server = express();
const PORT = 3000;

server.use(express.json());
server.use(helmet());
server.use(cors());

server.get('/ping', (req, res) => {
    res.status(200).send("pong");
})

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})