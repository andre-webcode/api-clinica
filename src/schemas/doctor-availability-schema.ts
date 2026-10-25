import z from "zod";


const timeSchema = z.string().regex(
    /^(?:[01]\d|2[0-3]):[0-5]\d$/,
    "Horário inválido"
)

function convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);

    if(hours === undefined || minutes === undefined){
        throw new Error("Horário inválido");
    }

    return hours * 60 + minutes;
}

export const doctorAvailabilitySchema = z.object({
    doctorId: z.number().int().positive(),
    dayOfWeek: z.enum([
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
    ]),
    startTime: timeSchema,
    endTime: timeSchema,
}).refine((data) =>
    convertTimeToMinutes(data.endTime) > convertTimeToMinutes(data.startTime),
    {
        message: "O horário final deve ser posterior ao horário inicial",
        path: ["endTime"],
    }
)


export type CreateDoctorAvailabilityInput = z.infer<
    typeof doctorAvailabilitySchema
>;