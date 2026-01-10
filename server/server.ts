import dotenv from "dotenv";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import path from "path";
import { notFoundHandler } from "./handlers/notFoundHandler";
import { STATIC_PREFIX, STATIC_ROOT } from "./constants/api";
import dbPlugin from "./plugins/dbPlugin";
import jwtPlugin from "./plugins/jwtPlugin";
import routes from "./routes";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";

dotenv.config();

const buildServer = () => {
  const fastify = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

  fastify.register(fastifyCookie);
  fastify.register(cors, {
    origin: ["http://85.198.87.33:3000"],
    credentials: true,                
  });

  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.register(dbPlugin);
  fastify.register(jwtPlugin);
  fastify.register(routes);

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
