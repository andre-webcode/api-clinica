import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import {
    createAppointment,
    getListAppointment,
    cancelAppointment,
} from "../../src/services/appointment.js";


vi.mock("../../src/services/appointment.js", () => ({
    createAppointment: vi.fn(),
    getListAppointment: vi.fn(),
    cancelAppointment: vi.fn(),
}));

describe("POST /appointments", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve criar um agendamento", async () => {
        const appointmentData = {
            patientId: 1,
            doctorId: 2,
            startAt: "2026-10-26T12:00:00.000Z",
        };

        const createdAppointment = {
            id: 1,
            patientId: 1,
            doctorId: 2,
            startAt: "2026-10-26T12:00:00.000Z",
            endAt: "2026-10-26T12:25:00.000Z",
            status: "SCHEDULED" as const,
        };

        vi.mocked(createAppointment).mockResolvedValue({
            appointment: {
                ...createdAppointment,
                startAt: new Date(createdAppointment.startAt),
                endAt: new Date(createdAppointment.endAt),
            },
        });

        const response = await request(app)
            .post("/appointments")
            .send(appointmentData);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(createdAppointment);
    });

    it("deve rejeitar dados inválidos", async () => {
        const response = await request(app)
            .post("/appointments")
            .send({
                patientId: 0,
                doctorId: 2,
                startAt: "data-invalida",
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: "INVALID_APPOINTMENT_DATA",
        });

        expect(createAppointment).not.toHaveBeenCalled();
    });

    it("deve retornar 404 quando o paciente não existir", async () => {
        vi.mocked(createAppointment).mockResolvedValue({
            error: "PATIENT_NOT_FOUND",
        });

        const response = await request(app)
            .post("/appointments")
            .send({
                patientId: 999,
                doctorId: 2,
                startAt: "2026-10-26T12:00:00.000Z",
            });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: "PATIENT_NOT_FOUND",
        });
    });

    it("deve retornar 404 quando o médico não existir", async () => {
        vi.mocked(createAppointment).mockResolvedValue({
            error: "DOCTOR_NOT_FOUND",
        });

        const response = await request(app)
            .post("/appointments")
            .send({
                patientId: 1,
                doctorId: 999,
                startAt: "2026-10-26T12:00:00.000Z",
            });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: "DOCTOR_NOT_FOUND",
        });
    });

    it("deve retornar 409 quando o horário estiver fora da disponibilidade", async () => {
        vi.mocked(createAppointment).mockResolvedValue({
            error: "OUTSIDE_DOCTOR_AVAILABILITY",
        });

        const response = await request(app)
            .post("/appointments")
            .send({
                patientId: 1,
                doctorId: 2,
                startAt: "2026-10-26T12:00:00.000Z",
            });

        expect(response.status).toBe(409);
        expect(response.body).toEqual({
            error: "OUTSIDE_DOCTOR_AVAILABILITY",
        });
    });
});

describe("GET /appointments", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve retornar a lista de agendamentos", async () => {
        const appointments = [
            {
                id: 1,
                patientId: 1,
                doctorId: 2,
                startAt: new Date("2026-10-26T12:00:00.000Z"),
                endAt: new Date("2026-10-26T12:25:00.000Z"),
                status: "SCHEDULED" as const,
                patient: {
                    id: 1,
                    name: "Naruto",
                    email: "naruto@email.com",
                    phone: "999999999",
                },
                doctor: {
                    id: 2,
                    name: "Kakashi",
                    specialty: "Clínico geral",
                    defaultDurationMinutes: 25,
                },
            },
        ];

        vi.mocked(getListAppointment).mockResolvedValue(appointments);

        const response = await request(app).get("/appointments");

        const expectedResponse = [
            {
                ...appointments[0],
                startAt: "2026-10-26T12:00:00.000Z",
                endAt: "2026-10-26T12:25:00.000Z",
            },
        ];

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedResponse);
    });

    it("deve retornar erro 500 quando ocorrer uma falha interna", async () => {
        vi.mocked(getListAppointment).mockRejectedValue(
            new Error("Erro interno")
        );
    
        const response = await request(app).get("/appointments");
    
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: "INTERNAL_SERVER_ERROR",
        });
    });
});

describe("PATCH /appointments/:id/cancel", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve cancelar um agendamento com sucesso", async () => {
        const cancelledAppointment = {
            id: 1,
            patientId: 1,
            doctorId: 2,
            startAt: new Date("2026-10-26T12:00:00.000Z"),
            endAt: new Date("2026-10-26T12:25:00.000Z"),
            status: "CANCELLED" as const,
        };

        vi.mocked(cancelAppointment).mockResolvedValue(cancelledAppointment);

        const response = await request(app)
            .patch("/appointments/1/cancel");

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("CANCELLED");
        expect(cancelAppointment).toHaveBeenCalledWith(1);
    });

    it("deve retornar 400 quando o ID for inválido", async () => {
        const response = await request(app)
            .patch("/appointments/abc/cancel");
    
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: "INVALID_APPOINTMENT_ID",
        });
        expect(cancelAppointment).not.toHaveBeenCalled();
    });

    it("deve retornar 404 quando o agendamento não existir", async () => {
        vi.mocked(cancelAppointment).mockResolvedValue({
            error: "APPOINTMENT_NOT_FOUND",
        });
    
        const response = await request(app)
            .patch("/appointments/999/cancel");
    
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: "Agendamento nao existe",
        });
        expect(cancelAppointment).toHaveBeenCalledWith(999);
    });
});