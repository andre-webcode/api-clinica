import type { CreateDoctorInput,  UpdateDoctorInput } from "../schemas/doctor-schema.js";
import { prisma } from "../utils/prisma.js";


export const createDoctor = async (data: CreateDoctorInput) => {
    const doctor = await prisma.doctor.create({
        data,
    });

    return doctor;
}

export const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({});

    return doctors;
}


export const updateDoctor = async (id: number, data: UpdateDoctorInput) => {
    const doctor = await prisma.doctor.update({
        where: {
            id,
        },
        data: {
            ...(data.name !== undefined ? { name: data.name } : {}),
            ...(data.specialty !== undefined ? { specialty: data.specialty } : {}),
            ...(data.defaultDurationMinutes !== undefined
                ? { defaultDurationMinutes: data.defaultDurationMinutes }
                : {}),
        },
    });
    
    return doctor;
}