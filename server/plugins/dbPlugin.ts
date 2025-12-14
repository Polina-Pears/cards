import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { Pool } from "pg";

declare module "fastify" {
    interface FastifyInstance {
        pg: Pool;
    }
}

async function dbPlugin(fastify: FastifyInstance) {
    const pool = new Pool({
        host: process.env.DB_HOST || "postgres",
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || "user",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_NAME || "database",
    });

    fastify.decorate("pg", pool);

    fastify.addHook("onClose", async () => {
        await pool.end();
    });

    fastify.log.info("PostgreSQL connected");
}

export default fastifyPlugin(dbPlugin);
