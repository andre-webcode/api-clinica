import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../src/utils/prisma.js";
import { createAppointment } from "../../src/services/appointment.js";

vi.mock("../../src/utils/prisma.js", () => ({
    prisma: {
        patient: { findUnique: vi.fn(), },
        doctor: { findUnique: vi.fn(), },
        appointment: {
            findFirst: vi.fn(),
            create: vi.fn(),
        },
    },
}));



describe("createAppointment", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("retorna erro quando o paciente não existe", async () => {
        vi.mocked(prisma.patient.findUnique).mockResolvedValue(null);

        const result = await createAppointment({
            patientId: 999,
            doctorId: 2,
            startAt: new Date("2026-10-26T12:00:00.000Z"),
        });

        expect(result).toEqual({
            error: "PATIENT_NOT_FOUND",
        });

        expect(prisma.doctor.findUnique).not.toHaveBeenCalled();
        expect(prisma.appointment.create).not.toHaveBeenCalled();
    });

    it("retorna erro quando o médico não existe", async () => {
        vi.mocked(prisma.patient.findUnique).mockResolvedValue({
            id: 1,
            name: "Paciente Teste",
            email: "teste@example.com",
            phone: "999999999",
        });

        vi.mocked(prisma.doctor.findUnique).mockResolvedValue(null);

        const result = await createAppointment({
            patientId: 1,
            doctorId: 999,
            startAt: new Date("2026-10-26T12:00:00.000Z"),
        });

        expect(result).toEqual({
            error: "DOCTOR_NOT_FOUND",
        });

        expect(prisma.appointment.create).not.toHaveBeenCalled();
    });


    it("retorna erro quando o médico não tem disponibilidade", async () => {
        vi.mocked(prisma.patient.findUnique).mockResolvedValue({
            id: 1,
            name: "Paciente Teste",
            email: "teste@example.com",
            phone: "999999999",
        });

        vi.mocked(prisma.doctor.findUnique).mockResolvedValue({
            id: 2,
            name: "Médico Teste",
            specialty: "Clínica Geral",
            defaultDurationMinutes: 25,
            doctorAvailabilities: [],
        });

        const result = await createAppointment({
            patientId: 1,
            doctorId: 2,
            startAt: new Date("2026-10-26T12:00:00.000Z"),
        });

        expect(result).toEqual({
            error: "OUTSIDE_DOCTOR_AVAILABILITY",
        });

        expect(prisma.appointment.findFirst).not.toHaveBeenCalled();
        expect(prisma.appointment.create).not.toHaveBeenCalled();
    });


    it("retorna erro quando existe conflito de horário", async () => {
        vi.mocked(prisma.patient.findUnique).mockResolvedValue({
            id: 1,
            name: "Paciente Teste",
            email: "teste@example.com",
            phone: "999999999",
        });

        vi.mocked(prisma.doctor.findUnique).mockResolvedValue({
            id: 2,
            name: "Médico Teste",
            specialty: "Clínica Geral",
            defaultDurationMinutes: 25,
            doctorAvailabilities: [
                {
                    id: 1,
                    doctorId: 2,
                    dayOfWeek: "MONDAY",
                    startTime: new Date("1970-01-01T08:00:00.000Z"),
                    endTime: new Date("1970-01-01T12:00:00.000Z"),
                },
            ],
        });

        vi.mocked(prisma.appointment.findFirst).mockResolvedValue({
            id: 10,
            patientId: 3,
            doctorId: 2,
            startAt: new Date("2026-10-26T12:00:00.000Z"),
            endAt: new Date("2026-10-26T12:25:00.000Z"),
            status: "SCHEDULED",
        });

        const result = await createAppointment({
            patientId: 1,
            doctorId: 2,
            startAt: new Date("2026-10-26T12:00:00.000Z"),
        });

        expect(result).toEqual({
            error: "APPOINTMENT_TIME_CONFLICT",
        });

        expect(prisma.appointment.create).not.toHaveBeenCalled();
    });


    it("cria um agendamento quando os dados são válidos", async () => {
        vi.mocked(prisma.patient.findUnique).mockResolvedValue({
            id: 1,
            name: "Paciente Teste",
            email: "teste@example.com",
            phone: "999999999",
        });

        vi.mocked(prisma.doctor.findUnique).mockResolvedValue({
            id: 2,
            name: "Médico Teste",
            specialty: "Clínica Geral",
            defaultDurationMinutes: 25,
            doctorAvailabilities: [
                {
                    id: 1,
                    doctorId: 2,
                    dayOfWeek: "MONDAY",
                    startTime: new Date("1970-01-01T08:00:00.000Z"),
                    endTime: new Date("1970-01-01T12:00:00.000Z"),
                },
            ],
        });

        vi.mocked(prisma.appointment.findFirst).mockResolvedValue(null);

        vi.mocked(prisma.appointment.create).mockResolvedValue({
            id: 11,
            patientId: 1,
            doctorId: 2,
            startAt: new Date("2026-10-26T12:00:00.000Z"),
            endAt: new Date("2026-10-26T12:25:00.000Z"),
            status: "SCHEDULED",
        });

        const result = await createAppointment({
            patientId: 1,
            doctorId: 2,
            startAt: new Date("2026-10-26T12:00:00.000Z"),
        });

        expect(result).toHaveProperty("appointment");
        expect(prisma.appointment.create).toHaveBeenCalledOnce();

        if ("appointment" in result) {
            expect(result.appointment).toMatchObject({
                id: 11,
                patientId: 1,
                doctorId: 2,
                status: "SCHEDULED",
            });
        }
    });


    it("rejeita agendamento que termina depois do horário de atendimento", async () => {
        vi.mocked(prisma.patient.findUnique).mockResolvedValue({
            id: 1,
            name: "Paciente Teste",
            email: "teste@example.com",
            phone: "999999999",
        });

        vi.mocked(prisma.doctor.findUnique).mockResolvedValue({
            id: 2,
            name: "Médico Teste",
            specialty: "Clínica Geral",
            defaultDurationMinutes: 25,
            doctorAvailabilities: [
                {
                    id: 1,
                    doctorId: 2,
                    dayOfWeek: "MONDAY",
                    startTime: new Date("1970-01-01T08:00:00.000Z"),
                    endTime: new Date("1970-01-01T12:00:00.000Z"),
                },
            ],
        });

        const result = await createAppointment({
            patientId: 1,
            doctorId: 2,
            startAt: new Date("2026-10-26T14:50:00.000Z"),
        });

        expect(result).toEqual({
            error: "OUTSIDE_DOCTOR_AVAILABILITY",
        });

        expect(prisma.appointment.findFirst).not.toHaveBeenCalled();
        expect(prisma.appointment.create).not.toHaveBeenCalled();
    });

});