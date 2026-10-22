import { Router } from "express";
import * as pingController from "../controllers/ping.js"
import * as patientController from "../controllers/patientController.js"


export const mainRouter = Router();

mainRouter.get("/ping", pingController.ping);

mainRouter.get("/patients", patientController.getPatients)
mainRouter.post("/patients",patientController.postPatient);