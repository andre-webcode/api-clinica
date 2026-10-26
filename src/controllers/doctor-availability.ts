import type { Request, Response } from "express";
import { doctorAvailabilitySchema } from "../schemas/doctor-availability-schema.js";
import { getDoctorAvailabilities, createDoctorAvailability, } from "../services/doctor-availability.js";
import { formatTime } from "../utils/format-time.js";


export const postDoctorAvailability = async (req: Request, res: Response) => {
    const doctorId = Number(req.params.doctorId);

    const result = doctorAvailabilitySchema.safeParse({ ...req.body, doctorId, });

    if (!result.success) {
        return res.status(400).json({
            message: "Dados de disponibilidade inválidos",
            errors: result.error.issues,
        });
    }

    const availabilityResult = await createDoctorAvailability(result.data);

    if ("error" in availabilityResult && availabilityResult.error === "DOCTOR_NOT_FOUND") {
        return res.status(404).json({
            message: "Médico não encontrado",
        });
    }

    if ("error" in availabilityResult && availabilityResult.error === "AVAILABILITY_OVERLAP") {
        return res.status(409).json({
            message: "Já existe disponibilidade nesse intervalo",
        });
    }


    return res.status(201).json(availabilityResult.availability);
};

export const listDoctorAvailabilities = async (req: Request, res: Response) => {
    const doctorId = Number(req.params.doctorId);

    if (!Number.isInteger(doctorId) || doctorId <= 0) {
        return res.status(400).json({
            message: "ID do médico inválido",
        });
    }

    const availabilities = await getDoctorAvailabilities(doctorId);

    if (availabilities === null) {
        return res.status(404).json({
            message: "Médico não encontrado",
        });
    }

    const formattedAvailabilities = availabilities.map((availability) => ({
        ...availability,
        startTime: formatTime(availability.startTime),
        endTime: formatTime(availability.endTime),
    }))

    return res.status(200).json(formattedAvailabilities);
};