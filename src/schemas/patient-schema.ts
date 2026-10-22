import z from "zod";

export const patientSchema = z.object({
    name: z.string().min(2, 'O nome é obrigatório'),
    email: z.email({ error: "E-mail inválido" }),
    phone: z.string().trim().min(1, "O telefone é obrigatório")
})

export type CreatePatientInput = z.infer<typeof patientSchema>;