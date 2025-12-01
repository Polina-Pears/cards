import Fastify from "fastify";

const buildServer = () => {
  const fastify = Fastify({
    logger: true
  });

  fastify.get("/", async () => {
    return { message: "Hello from Fastify + TS 🚀" };
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
