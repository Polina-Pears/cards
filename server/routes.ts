import { FastifyInstance } from "fastify";
import { API_SIGNIN, API_SIGNUP } from "./constants/api";
import { signinHandler } from "./handlers/signinHandler";
import { signupHandler } from "./handlers/signupHandler";
import signupBodySchema from "./shema/signup.body";

export default async function authRoutes(fastify: FastifyInstance) {

    fastify.post(API_SIGNUP,
        { schema: { body: signupBodySchema } },
        signupHandler
    );
    fastify.post(API_SIGNIN,
        signinHandler
    );

}
