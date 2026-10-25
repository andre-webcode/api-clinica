import type { CreateDoctorAvailabilityInput } from "../schemas/doctor-availability-schema.js"; import { convertTimeToDate } from "../utils/convert-time-to-date.js";
import { prisma } from "../utils/prisma.js";


export const createDoctorAvailability = async (data: CreateDoctorAvailabilityInput) => {

    const doctor = await prisma.doctor.findUnique({
        where: {
            id: data.doctorId
        },
        select: {
            id: true,
            doctorAvailabilities: {
                where: {
                    dayOfWeek: data.dayOfWeek,
                },
                select: {
                    startTime: true,
                    endTime: true,
                },
            }
        }
    });

    if (!doctor) {
        return { error: "DOCTOR_NOT_FOUND" } as const;
    }

    const startTime = convertTimeToDate(data.startTime);
    const endTime = convertTimeToDate(data.endTime);

    const newStart = startTime.getUTCHours() * 60 + startTime.getUTCMinutes();
    const newEnd = endTime.getUTCHours() * 60 + endTime.getUTCMinutes();

    const hasOverlap = doctor.doctorAvailabilities.some((availability) => {
        const existingStart =
            availability.startTime.getUTCHours() * 60 +
            availability.startTime.getUTCMinutes();

        const existingEnd =
            availability.endTime.getUTCHours() * 60 +
            availability.endTime.getUTCMinutes();

        return newStart < existingEnd && newEnd > existingStart;
    });

    if (hasOverlap) {
        return { error: "AVAILABILITY_OVERLAP" } as const;
    }


    const availability = await prisma.doctorAvailability.create({
        data: {
            doctorId: data.doctorId,
            dayOfWeek: data.dayOfWeek,
            startTime,
            endTime,
        },
    });

    return { availability } as const;
}