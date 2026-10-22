import z from "zod";

export const doctorSchema = z.object({
    name: z.string({ message: "O nome é obrigatório" }).trim().min(2),
    specialty: z.string({ message: "A especialidade é obrigatória" }),
    defaultDurationMinutes: z.number().int().positive(),
})

export type CreateDoctorInput = z.infer<typeof doctorSchema>;