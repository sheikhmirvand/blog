import e from "express";
import AuthController from "../../controllers/authController";
import User from "../../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transport } from "../../utils/nodeMailer";

const mockRequest = () => {
    return {
        body: {
            name: "test",
            email: "test@gmail.com",
            password: "12345678",
        },
    };
};

const mockResponse = () => {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis,
    };
};

const mockUser = {
    _id: "6547e379b1b04e89fb440625",
    name: "test",
    email: "test@gmail.com",
    password: "hashedPassword",
};

afterEach(() => {
    jest.resetAllMocks();
});

describe("test auth controller/register", () => {
    test("error for empty body", async () => {
        // @ts-ignore
        const mockReq = (mockRequest().body = { body: {} });
        const mockRes = mockResponse();

        // @ts-ignore
        await AuthController.register(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test("error for exists user", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(mockUser);

        const mockReq = mockRequest();
        const mockRes = mockResponse();

        // @ts-ignore
        await AuthController.register(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test("register success test", async () => {
        // @ts-ignore
        jest.spyOn(User, "findOne").mockResolvedValueOnce(false);
        // @ts-ignore
        jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedPassword");
        // @ts-ignore
        jest.spyOn(User, "create").mockResolvedValueOnce(mockUser);
        // @ts-ignore
        jest.spyOn(jwt, "sign").mockResolvedValueOnce("token");
        const mockReq = mockRequest();
        const mockRes = mockResponse();

        // @ts-ignore
        await AuthController.register(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
    });
});

describe("test login controller", () => {
    test("success login test", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(mockUser);

        // @ts-ignore
        jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true);

        // @ts-ignore
        jest.spyOn(jwt, "sign").mockResolvedValueOnce("token");

        const mockReq = mockRequest();
        const mockRes = mockResponse();

        // @ts-ignore
        await AuthController.login(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test("error for empty body", async () => {
        // @ts-ignore
        const mockReq = (mockRequest().body = { body: {} });
        const mockRes = mockResponse();

        // @ts-ignore
        await AuthController.login(mockReq, mockRes);
    });

    test("err for user not found", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(false);

        // @ts-ignore
        const mockReq = mockRequest();

        const mockRes = mockResponse();

        // @ts-ignore
        await AuthController.login(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test("error for not valid password", async () => {
        // @ts-ignore
        jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(false);

        const mockReq = mockRequest();
        const mockRes = mockResponse();

        // @ts-ignore
        await AuthController.login(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
    });
});

describe("forgotPassword test", () => {
    test("success send forgot email", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(mockUser);

        // @ts-ignore
        jest.spyOn(jwt, "sign").mockResolvedValueOnce("token");

        const mockReq = mockRequest();
        const mockRes = mockResponse();

        // @ts-ignore
        await AuthController.forgotPassword(mockReq, mockRes);
    });

    test("error for empty body", async () => {
        // @ts-ignore
        const mockReq = (mockRequest().body = { body: {} });
        const mockRes = mockResponse();

        // @ts-ignore
        await AuthController.forgotPassword(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test("error for not valid email and not exists user", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(false);

        const mockReq = mockRequest();
        const mockRes = mockResponse();

        // @ts-ignore
        await AuthController.forgotPassword(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(404);
    });
});
