import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import {
    createDoctorAvailability,
    getDoctorAvailabilities,
} from "../../src/services/doctor-availability.js";


vi.mock("../../src/services/doctor-availability.js", () => ({
    createDoctorAvailability: vi.fn(),
    getDoctorAvailabilities: vi.fn(),
}));


describe("POST /doctors/:doctorId/availabilities", () => {
    beforeEach(() => { vi.clearAllMocks() });

    it("deve cadastrar uma disponibilidade", async () => {
        const availability = {
            id: 1,
            doctorId: 1,
            dayOfWeek: "MONDAY" as const,
            startTime: new Date("1970-01-01T08:00:00.000Z"),
            endTime: new Date("1970-01-01T12:00:00.000Z"),
        };

        vi.mocked(createDoctorAvailability).mockResolvedValue({ availability, });

        const response = await request(app)
            .post("/doctors/1/availabilities")
            .send({
                dayOfWeek: "MONDAY",
                startTime: "08:00",
                endTime: "12:00",
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            ...availability,
            startTime: availability.startTime.toISOString(),
            endTime: availability.endTime.toISOString(),
        });
    });


    it("deve retornar 404 quando o médico não existir", async () => {
        vi.mocked(createDoctorAvailability).mockResolvedValue({
            error: "DOCTOR_NOT_FOUND",
        });

        const response = await request(app)
            .post("/doctors/999/availabilities")
            .send({
                dayOfWeek: "MONDAY",
                startTime: "08:00",
                endTime: "12:00",
            });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: "Médico não encontrado",
        });
    });


    it("deve retornar 409 quando houver conflito de horários", async () => {
        vi.mocked(createDoctorAvailability).mockResolvedValue({
            error: "AVAILABILITY_OVERLAP",
        });

        const response = await request(app)
            .post("/doctors/1/availabilities")
            .send({
                dayOfWeek: "MONDAY",
                startTime: "09:00",
                endTime: "11:00",
            });

        expect(response.status).toBe(409);
        expect(response.body).toEqual({
            message: "Já existe disponibilidade nesse intervalo",
        });
    });


    it("deve retornar 400 quando os dados forem inválidos", async () => {
        const response = await request(app)
            .post("/doctors/1/availabilities")
            .send({
                dayOfWeek: "FUNDAY",
                startTime: "08:00",
                endTime: "12:00",
            });

        expect(response.status).toBe(400);
        expect(createDoctorAvailability).not.toHaveBeenCalled();
    });
});


describe("GET /doctors/:doctorId/availabilities", () => {
    beforeEach(() => { vi.clearAllMocks() });

    it("deve listar as disponibilidades do médico", async () => {
        const availabilities = [
            {
                id: 1,
                doctorId: 1,
                dayOfWeek: "MONDAY" as const,
                startTime: new Date("1970-01-01T08:00:00.000Z"),
                endTime: new Date("1970-01-01T12:00:00.000Z"),
            },
        ];

        vi.mocked(getDoctorAvailabilities).mockResolvedValue(availabilities);

        const response = await request(app)
            .get("/doctors/1/availabilities");

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                id: 1,
                doctorId: 1,
                dayOfWeek: "MONDAY",
                startTime: "08:00",
                endTime: "12:00",
            },
        ]);
    });

    it("deve retornar 404 quando o médico não existir", async () => {
        vi.mocked(getDoctorAvailabilities).mockResolvedValue(null);
    
        const response = await request(app)
            .get("/doctors/999/availabilities");
    
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: "Médico não encontrado",
        });
    });

    it("deve retornar 400 quando o ID for zero", async () => {
        const response = await request(app)
            .get("/doctors/0/availabilities");
    
        expect(response.status).toBe(400);
        expect(getDoctorAvailabilities).not.toHaveBeenCalled();
    });
    
    it("deve retornar 400 quando o ID não for numérico", async () => {
        const response = await request(app)
            .get("/doctors/abc/availabilities");
    
        expect(response.status).toBe(400);
        expect(getDoctorAvailabilities).not.toHaveBeenCalled();
    });
});