import { Router } from "express";
import * as pingController from "../controllers/ping.js"
import * as patientController from "../controllers/patient.js"
import * as doctorController from "../controllers/doctor.js"
import * as doctorAvailabilityController from "../controllers/doctor-availability.js";


export const mainRouter = Router();

mainRouter.get("/ping", pingController.ping);

mainRouter.get("/patients", patientController.getPatients)
mainRouter.post("/patients", patientController.postPatient)

mainRouter.post("/doctors", doctorController.postDoctor)
mainRouter.get("/doctors",doctorController.getDoctors)

mainRouter.post("/doctors/:doctorId/availabilities", doctorAvailabilityController.postDoctorAvailability)
