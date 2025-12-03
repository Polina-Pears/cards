import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { hashPassword } from "../utils/hashPassword";
import RegistrationBody from "../type/RegistrationBody";

export const signupHandler = async (
    request: FastifyRequest,
    reply: FastifyReply,
    fastify: FastifyInstance
) => {
    const { login, password } = request.body as RegistrationBody;

    // Валидация
    if (!login || !password) {
        return reply.status(400).send({ error: "Email and password are required" });
    }

    // Хеширование пароля
    const passwordHash = await hashPassword(password);

    return {
        login,
        passwordHash,
        password
    };
};
