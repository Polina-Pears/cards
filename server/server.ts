import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import path from "path";

const buildServer = () => {
  const fastify = Fastify({
    logger: true
  });
  
  fastify.get("/api/hello", async () => {
    return { message: "Hello from API" };
  });

  // Путь к клиентской сборке: dist/client
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "client"),
    prefix: "/",
  });

  fastify.setNotFoundHandler((req, reply) => {
    const url = req.raw.url || "";

    if (url.startsWith("/api")) {
      return reply.status(404).send({ error: "Not Found" });
    }
    
    return reply.sendFile("index.html");
  });

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
