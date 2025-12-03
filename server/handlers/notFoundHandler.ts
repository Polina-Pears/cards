import { FastifyRequest, FastifyReply } from "fastify";
import { API_PREFIX, INDEX_FILE, HTTP_STATUS, ERROR_MESSAGES } from "../constants/api";

export const notFoundHandler = (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const url = request.raw.url || "";

    if (url.startsWith(API_PREFIX)) {
        return reply.status(HTTP_STATUS.NOT_FOUND).send({ error: ERROR_MESSAGES.NOT_FOUND });
    }

    return reply.sendFile(INDEX_FILE);
};
