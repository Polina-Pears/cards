
import { FastifyRequest, FastifyReply } from "fastify"; 

export const meHandler = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    return reply.status(200).send({
        user: (request as any).user.id
    }); 
};