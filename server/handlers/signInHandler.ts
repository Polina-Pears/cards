import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import AuthBody from "../type/AuthBody";


export const signInHandler = async (
    request: FastifyRequest,
    reply: FastifyReply,
    fastify: FastifyInstance
) => {
    const { login, password } = request.body as AuthBody;

    // Валидация
    if (!login || !password) {
        return reply.status(400).send({ error: "Email and password are required" });
    }


    return {  login, password };
};
