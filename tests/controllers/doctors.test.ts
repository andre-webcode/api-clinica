import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { getAllDoctors, createDoctor } from "../../src/services/doctor.js";


vi.mock("../../src/services/doctor.js", () => ({
    getAllDoctors: vi.fn(),
    createDoctor: vi.fn(),
}));

describe("GET /doctors", () => {
    beforeEach(() => { vi.clearAllMocks() });

    it("deve retornar a lista de médicos", async () => {
        const doctors = [
            {
                id: 1,
                name: "Arnaldo",
                specialty: "Cardiologia",
                defaultDurationMinutes: 30,
            },
            {
                id: 2,
                name: "Kakashi",
                specialty: "Clínico geral",
                defaultDurationMinutes: 25,
            },
        ];

        vi.mocked(getAllDoctors).mockResolvedValue(doctors);

        const response = await request(app).get("/doctors");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(doctors);
    });
});


describe("POST /doctors", () => {
    beforeEach(() => { vi.clearAllMocks() });

    it("deve cadastrar um médico", async () => {
        const doctorData = {
            name: "Naruto",
            specialty: "Pediatria",
            defaultDurationMinutes: 30,
        };

        const createdDoctor = {
            id: 3,
            ...doctorData,
        };

        vi.mocked(createDoctor).mockResolvedValue(createdDoctor);

        const response = await request(app)
            .post("/doctors")
            .send(doctorData);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(createdDoctor);
    });

    it("não deve cadastrar um médico com dados inválidos", async () => {
        const invalidData = {
            name: "A",
            specialty: "Pediatria",
            defaultDurationMinutes: -10,
        };

        const response = await request(app)
            .post("/doctors")
            .send(invalidData);

        expect(response.status).toBe(400);
        expect(createDoctor).not.toHaveBeenCalled();
    });
});