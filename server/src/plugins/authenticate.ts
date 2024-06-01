import { FastifyRequest } from "fastify";

export async function authenticate(fastify: FastifyRequest) {
  await fastify.jwtVerify();
}
