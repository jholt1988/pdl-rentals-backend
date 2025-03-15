import request from "supertest";
import app from "../../server";
import { User } from "../../models";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../../models");

describe("Auth Controller Tests", () => {
    // Add beforeEach to clean up mocks
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Add afterAll to clean up after tests
    afterAll(() => {
        jest.resetAllMocks();
    });

    describe("Register", () => {
        const validUserData = {
            name: "Test User",
            email: "test@example.com",
            password: "password123",
        };

        it("should register a new user", async () => {
            User.create.mockResolvedValue({ id: 1, email: validUserData.email });

            const res = await request(app)
                .post("/api/auth/register")
                .send(validUserData);

            expect(res.status).toBe(201);
            expect(res.body.message).toBe("User registered successfully");
            expect(User.create).toHaveBeenCalledTimes(1);
            expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
                name: validUserData.name,
                email: validUserData.email
            }));
        });

        // Add error case test
        it("should handle registration errors", async () => {
            User.create.mockRejectedValue(new Error("Database error"));

            const res = await request(app)
                .post("/api/auth/register")
                .send(validUserData);

            expect(res.status).toBe(500);
            expect(User.create).toHaveBeenCalledTimes(1);
        });
    });

    describe("Login", () => {
        const validCredentials = {
            email: "test@example.com",
            password: "password123"
        };

        it("should login a user and return a JWT", async () => {
            const hashedPassword = await hash(validCredentials.password, 10);
            const mockUser = {
                id: 1,
                email: validCredentials.email,
                password: hashedPassword,
            };

            User.findOne.mockResolvedValue(mockUser);

            const res = await request(app)
                .post("/api/auth/login")
                .send(validCredentials);

            expect(res.status).toBe(200);
            expect(res.body.accessToken).toBeDefined();
            expect(User.findOne).toHaveBeenCalledTimes(1);
            expect(User.findOne).toHaveBeenCalledWith(
                expect.objectContaining({ email: validCredentials.email })
            );
        });

        // Add invalid credentials test
        it("should reject invalid credentials", async () => {
            const hashedPassword = await hash(validCredentials.password, 10);
            const mockUser = {
                id: 1,
                email: validCredentials.email,
                password: hashedPassword,
            };

            User.findOne.mockResolvedValue(mockUser);

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: validCredentials.email,
                    password: "wrongpassword"
                });

            expect(res.status).toBe(401);
            expect(res.body.accessToken).toBeUndefined();
        });
    });
});