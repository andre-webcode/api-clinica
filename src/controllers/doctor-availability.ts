import type { Request, Response } from "express";
import { doctorAvailabilitySchema } from "../schemas/doctor-availability-schema.js";
import { createDoctorAvailability } from "../services/doctor-availability.js";


export const postDoctorAvailability = async (req: Request, res: Response) => {
    const doctorId = Number(req.params.doctorId);

    const result = doctorAvailabilitySchema.safeParse({ ...req.body, doctorId, });

    if (!result.success) {
        return res.status(400).json({
            message: "Dados de disponibilidade inválidos",
            errors: result.error.issues,
        });
    }

    const availability = await createDoctorAvailability(result.data);

    if (!availability) {
        return res.status(404).json({
            message: "Médico não encontrado",
        })
    }

    return res.status(201).json(availability)
}