
import { z } from "zod";

export const appointmentSchema = z.object({
    patientId: z.number().int().positive(),
    doctorId: z.number().int().positive(),
    startAt: z.iso.datetime({ offset: true }).transform((value) => new Date(value)),});

export type CreateAppointmentRequest = z.infer<typeof appointmentSchema>;
