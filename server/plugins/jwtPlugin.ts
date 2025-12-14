import fastifyJwt from "@fastify/jwt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import JWT_SECRET from "../constants/JWT_SECRET";
import fastifyPlugin from "fastify-plugin";

declare module "fastify" {
    interface FastifyInstance {
        authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: { id: number };
        user: { id: number };
    }
}

async function jwtPlugin(fastify: FastifyInstance) {
    fastify.register(fastifyJwt, {
        secret: JWT_SECRET
    });

    fastify.decorate(
        "authenticate",
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                await request.jwtVerify();
            } catch (err) {
                request.log.error(err);
                return reply.code(401).send({ message: "Unauthorized" });
            }
        }
    );
}

export default fastifyPlugin(jwtPlugin);