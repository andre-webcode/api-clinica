import { calculateAppointmentEnd } from "../utils/calculate-appointment.js";
import { getAppointmentLocalTime } from "../utils/get-appointment.js";
import { getAvailabilityMinutes } from "../utils/get-availability-minutes.js";
import { prisma } from "../utils/prisma.js";

type CreateAppointmentInput = {
    patientId: number;
    doctorId: number;
    startAt: Date;
};

export const createAppointment = async (data: CreateAppointmentInput) => {
    const patient = await prisma.patient.findUnique({
        where: {
            id: data.patientId,
        },
    });

    if (!patient) {
        return { error: "PATIENT_NOT_FOUND" }
    }

    const doctor = await prisma.doctor.findUnique({
        where: {
            id: data.doctorId,
        },
        include: {
            doctorAvailabilities: true,
        }
    });

    if (!doctor) {
        return { error: "DOCTOR_NOT_FOUND" }
    }


    const endAt = calculateAppointmentEnd(data.startAt, doctor.defaultDurationMinutes);

    const appointmentStart = getAppointmentLocalTime(data.startAt);
    const appointmentEnd = getAppointmentLocalTime(endAt);

    const dayAvailabilities = doctor.doctorAvailabilities.filter(
        (availability) => availability.dayOfWeek === appointmentStart.dayOfWeek
    );

    const isWithinAvailability = dayAvailabilities.some((availability) => {
        const availabilityStart = getAvailabilityMinutes(availability.startTime);
        const availabilityEnd = getAvailabilityMinutes(availability.endTime);

        return (
            appointmentEnd.dayOfWeek === appointmentStart.dayOfWeek &&
            appointmentStart.minutesSinceMidnight >= availabilityStart &&
            appointmentEnd.minutesSinceMidnight <= availabilityEnd
        );
    });


    if (!isWithinAvailability) {
        return { error: "OUTSIDE_DOCTOR_AVAILABILITY" };
    }

    const conflictingAppointment = await prisma.appointment.findFirst({
        where: {
            doctorId: doctor.id,
            status: { not: "CANCELLED" },
            startAt: { lt: endAt },
            endAt: { gt: data.startAt },
        },
    });

    if (conflictingAppointment) {
        return { error: "APPOINTMENT_TIME_CONFLICT" as const };
    }

    const appointment = await prisma.appointment.create({
        data: {
            patientId: patient.id,
            doctorId: doctor.id,
            startAt: data.startAt,
            endAt,
        },
    });

    return { appointment };
};

export const getListAppointment = async () => {
    const appointments = await prisma.appointment.findMany({
        include: {
            patient: true,
            doctor: true,
        }
    });

    return appointments;
}