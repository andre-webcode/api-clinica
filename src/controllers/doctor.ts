import type { Request, Response } from "express";
import { doctorSchema } from "../schemas/doctor-schema.js";
import { createDoctor, getAllDoctors } from "../services/doctor.js";


export const postDoctor = async (req: Request, res: Response) => {
    const result = doctorSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Dados inválidos",
        })
    }

    const doctor = await createDoctor(result.data);

    return res.status(201).json(doctor);
}

export const getDoctors = async (req: Request, res: Response) => {
    const doctors = await getAllDoctors();

    return res.status(200).json(doctors);
}