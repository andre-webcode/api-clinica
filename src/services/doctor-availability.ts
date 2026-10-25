import type { CreateDoctorAvailabilityInput } from "../schemas/doctor-availability-schema.js"; import { convertTimeToDate } from "../utils/convert-time-to-date.js";
import { prisma } from "../utils/prisma.js";


export const createDoctorAvailability = async (data: CreateDoctorAvailabilityInput) => {
    const availability = await prisma.doctorAvailability.create({
        data: {
            doctorId: data.doctorId,
            dayOfWeek: data.dayOfWeek,
            startTime: convertTimeToDate(data.startTime),
            endTime: convertTimeToDate(data.endTime),
        },
    });

    return availability;
}