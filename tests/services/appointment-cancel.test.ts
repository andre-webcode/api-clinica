import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../src/utils/prisma.js";
import { cancelAppointment } from "../../src/services/appointment.js";

import { AppointmentStatus } from "../../src/generated/prisma/client.js";
import { Prisma } from "../../src/generated/prisma/client.js";

vi.mock("../../src/utils/prisma.js", () => ({
    prisma: {
        appointment: {
            update: vi.fn(),
        }
    }
}))

describe("cancelAppointment", () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it("deve cancelar um agendamento com sucesso", async () => {
        const appointment = {
            id: 1,
            startAt: new Date("2026-10-26T12:00:00.000Z"),
            endAt: new Date("2026-10-26T12:25:00.000Z"),
            status: AppointmentStatus.CANCELLED,
            patientId: 1,
            doctorId: 2,
        };

        vi.mocked(prisma.appointment.update).mockResolvedValue(appointment);

        const result = await cancelAppointment(1);

        expect(result).toEqual(appointment);

        expect(prisma.appointment.update).toHaveBeenCalledWith({
            where: {
                id: 1,
            },
            data: {
                status: AppointmentStatus.CANCELLED,
            }
        })
    });

    it("deve retornar erro quando o agendamento não existe", async () => {
        const error = new Prisma.PrismaClientKnownRequestError(
            "Record to update not found.",
            {
                code: "P2025",
                clientVersion: "7.0.0",
            },
        );

        vi.mocked(prisma.appointment.update).mockRejectedValue(error);

        const result = await cancelAppointment(999);

        expect(result).toEqual({ error: "APPOINTMENT_NOT_FOUND", });
    });

    it("deve repassar erros inesperados", async () => {
        const error = new Error("Database unavailable");

        vi.mocked(prisma.appointment.update).mockRejectedValue(error);

        await expect(cancelAppointment(1)).rejects.toThrow(
            "Database unavailable",
        );
    });
});