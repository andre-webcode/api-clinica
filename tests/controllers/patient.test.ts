import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { createPatient, getAllPatients } from "../../src/services/patient.js";

vi.mock("../../src/services/patient.js", () => ({
    getAllPatients: vi.fn(),
    createPatient: vi.fn(),
}));

describe("GET /patients", () => {
    beforeEach(() => { vi.clearAllMocks() });

    it("deve retornar a lista de pacientes com status 200", async () => {
        const patients = [
            {
                id: 1,
                name: "Maria Silva",
                email: "maria@email.com",
                phone: "999999999",
            },
            {
                id: 2,
                name: "João Santos",
                email: "joao@email.com",
                phone: "988888888",
            },
        ];

        vi.mocked(getAllPatients).mockResolvedValue(patients);

        const response = await request(app).get("/patients");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(patients);
    });

    it("deve retornar 500 quando ocorrer um erro no service", async () => {
        vi.mocked(getAllPatients).mockRejectedValue(new Error("Database unavailable"),);

        const response = await request(app).get("/patients");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: "INTERNAL_SERVER_ERROR",
        });
    });
});

describe("POST /patients", () => {
    beforeEach(() => { vi.clearAllMocks() });

    it("deve cadastrar um paciente com sucesso", async () => {
        const patientData = {
            name: "Maria Silva",
            email: "maria@email.com",
            phone: "999999999",
        };

        const createdPatient = {
            id: 1,
            ...patientData,
        }

        vi.mocked(createPatient).mockResolvedValue(createdPatient);

        const response = await request(app)
            .post("/patients")
            .send(patientData);


        expect(response.status).toBe(201);
        expect(response.body).toEqual(createdPatient);
    });

    it("deve retornar 400 quando os dados forem inválidos", async () => {
        const invalidPatient = {
            name: "A",
            email: "email-invalido",
            phone: "",
        };

        const response = await request(app)
            .post("/patients")
            .send(invalidPatient);


        expect(response.status).toBe(400);

        expect(createPatient).not.toHaveBeenCalled()
    });
});