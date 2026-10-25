import { describe, it, expect } from "vitest";
import { doctorAvailabilitySchema } from "../../src/schemas/doctor-availability-schema.js";

describe("doctorAvailabilitySchema", () => {
    it("aceita um intervalo de horário válido", () => {
        const result = doctorAvailabilitySchema.safeParse({
            doctorId: 1,
            dayOfWeek: "MONDAY",
            startTime: "08:00",
            endTime: "12:00",
        });

        expect(result.success).toBe(true);
    });


    it("rejeita quando o horário final é anterior ao inicial", () => {
        const result = doctorAvailabilitySchema.safeParse({
            doctorId: 1,
            dayOfWeek: "MONDAY",
            startTime: "12:00",
            endTime: "08:00",
        });

        expect(result.success).toBe(false);
    });

    it("rejeita quando o horário final é igual ao inicial", () => {
        const result = doctorAvailabilitySchema.safeParse({
            doctorId: 1,
            dayOfWeek: "MONDAY",
            startTime: "08:00",
            endTime: "08:00",
        });
    
        expect(result.success).toBe(false);
    });

    it("rejeita horários fora do formato válido", () => {
        const result = doctorAvailabilitySchema.safeParse({
            doctorId: 1,
            dayOfWeek: "MONDAY",
            startTime: "25:90",
            endTime: "26:00",
        });
    
        expect(result.success).toBe(false);
    });

    it("rejeita um dia da semana inválido", () => {
        const result = doctorAvailabilitySchema.safeParse({
            doctorId: 1,
            dayOfWeek: "FUNDAY",
            startTime: "08:00",
            endTime: "12:00",
        });
    
        expect(result.success).toBe(false);
    })

    it("rejeita um ID de médico igual a zero", () => {
        const result = doctorAvailabilitySchema.safeParse({
            doctorId: 0,
            dayOfWeek: "MONDAY",
            startTime: "08:00",
            endTime: "12:00",
        });
    
        expect(result.success).toBe(false);
    });
});

