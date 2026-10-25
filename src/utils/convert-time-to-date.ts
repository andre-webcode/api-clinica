import type { CreateDoctorAvailabilityInput } from "../schemas/doctor-availability-schema.js";

export function convertTimeToDate(time: string): Date {
    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date("1970-01-01T00:00:00.000Z");
    date.setUTCHours(hours!, minutes!, 0, 0);

    return date;
}