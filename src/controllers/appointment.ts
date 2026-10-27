
import type { Request, Response } from "express";
import { appointmentSchema } from "../schemas/appointment-schema.js";
import { createAppointment } from "../services/appointment.js";

export const appointmentPost = async (req: Request, res: Response) => {
    const validation = appointmentSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            error: "INVALID_APPOINTMENT_DATA",
        });
    }

    try {
        const result = await createAppointment(validation.data);

        if ("error" in result) {
            switch (result.error) {
                case "PATIENT_NOT_FOUND":
                case "DOCTOR_NOT_FOUND":
                    return res.status(404).json({
                        error: result.error,
                    });

                case "OUTSIDE_DOCTOR_AVAILABILITY":
                case "APPOINTMENT_TIME_CONFLICT":
                    return res.status(409).json({
                        error: result.error,
                    });
            }
        }

        return res.status(201).json(result.appointment);
        
    } catch {
        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR",
        });
    }

};
