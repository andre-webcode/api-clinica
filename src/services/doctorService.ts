import type { CreateDoctorInput } from "../schemas/doctor-schema.js";
import { prisma } from "../utils/prisma.js";


export const createDoctor = async (data: CreateDoctorInput) => {
    const doctor = await prisma.doctor.create({
        data,
    });

    return doctor;
}