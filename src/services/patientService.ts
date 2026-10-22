import type { CreatePatientInput } from "../schemas/patient-schema.js";
import { prisma } from "../utils/prisma.js"


export const getAllPatients = async () => {
    const patients = await prisma.patient.findMany();

    return patients;
}


export const createPatient = async (data: CreatePatientInput) => {
    const patient = await prisma.patient.create({
        data,
    });

    return patient;
}