import type { Request, Response } from "express";
import { doctorSchema } from "../schemas/doctor-schema.js";
import { updateDoctorSchema } from "../schemas/doctor-schema.js";
import { updateDoctor } from "../services/doctor.js";
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

export const patchDoctor = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "ID inválido"
        });
    }

    const result = updateDoctorSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Dados inválidos"
        });
    }

    if (Object.keys(result.data).length === 0) {
        return res.status(400).json({
            message: "Informe ao menos um campo para atualizar"
        });
    }

    const doctor = await updateDoctor(id, result.data);

    return res.status(200).json(doctor);
}