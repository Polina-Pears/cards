import dotenv from "dotenv";
import fastifyJwt from "@fastify/jwt";
// import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import path from "path";
import { signUpHandler } from "./handlers/signUpHandler";
import { signInHandler } from "./handlers/signInHandler.ts";
import { notFoundHandler } from "./handlers/notFoundHandler";
import {
  API_SIGNUP,
  API_SIGNIN,
  STATIC_PREFIX,
  STATIC_ROOT,
  // HTTP_METHODS
} from "./constants/api";

dotenv.config();

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number; email: string };
    user: { id: number; email: string };
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
// const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173", "http://localhost:3000"];

const buildServer = () => {
  const fastify = Fastify({
    logger: true
  });

  if (!process.env.JWT_SECRET) {
    fastify.log.warn("JWT_SECRET is not set, using an insecure fallback.");
  }

  fastify.register(fastifyJwt, {
    secret: JWT_SECRET
  });

  // fastify.register(fastifyCors, {
  //   origin: ALLOWED_ORIGINS,
  //   credentials: true,
  //   methods: [HTTP_METHODS.GET, HTTP_METHODS.POST, HTTP_METHODS.PUT, HTTP_METHODS.DELETE],
  //   allowedHeaders: ["Content-Type", "Authorization"]
  // });

  fastify.post(API_SIGNUP, async (request, reply) =>
    signUpHandler(request, reply, fastify));

  fastify.post(API_SIGNIN, async (request, reply) =>
    signInHandler(request, reply, fastify));

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, STATIC_ROOT),
    prefix: STATIC_PREFIX
  });

  fastify.setNotFoundHandler(notFoundHandler);

  return fastify;
};

const start = async () => {
  const fastify = buildServer();
  const port = Number(process.env.PORT) || 3000;
  const host = "0.0.0.0";

  try {
    await fastify.listen({ port, host });
    console.log(`Server is running on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
