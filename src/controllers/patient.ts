import type { Request, Response } from "express";
import { createPatient, getAllPatients } from "../services/patient.js";
import { patientSchema } from "../schemas/patient-schema.js";
import z from "zod";


export const getPatients = async (req: Request, res: Response) => {
  
    const patients = await getAllPatients();

    return res.status(200).json(patients);
}


export const postPatient = async (req: Request, res: Response) => {
    const result = patientSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Dados inválidos. Verifique as informações enviadas.",
            errors: z.flattenError(result.error).fieldErrors,
        });
    }

    const patient = await createPatient(result.data);

    return res.status(201).json(patient);

}