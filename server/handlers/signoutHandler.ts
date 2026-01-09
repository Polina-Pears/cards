
import { FastifyRequest, FastifyReply } from "fastify";

export const signout = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    reply.clearCookie("token", {
        path: "/", 
    });

    return reply.status(200).send({ message: "Logged out successfully" });
};