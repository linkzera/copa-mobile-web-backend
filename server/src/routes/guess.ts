import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();
    return { count };
  });

  fastify.post(
    "/pools/:poolId/games/:gameId/guesses",
    { onRequest: [authenticate] },
    async (req, res) => {
      const creactGuessParams = z.object({
        poolId: z.string(),
        gameId: z.string(),
      });

      const creactGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });

      const { poolId, gameId } = creactGuessParams.parse(req.params);
      const { firstTeamPoints, secondTeamPoints } = creactGuessBody.parse(
        req.body
      );

      const participant = await prisma.participant.findUnique({
        where: {
          userId_poolId: {
            poolId,
            userId: req.user.sub,
          },
        },
      });

      if (!participant) {
        return res
          .status(400)
          .send({
            message: "You are not allowed to create a guess inside this pool",
          });
      }

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          },
        },
      });

      if (guess) {
        return res
          .status(400)
          .send({
            message: "You already sent a guess to this game on this pool",
            guess,
          });
      }

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        return res.status(400).send({ message: "Game not found" });
      }

      if (game.date < new Date()) {
        return res
          .status(400)
          .send({ message: "You cannot send guesses after this game date" });
      }

      await prisma.guess.create({
        data: {
          firstTeamPoints,
          secondTeamPoints,
          gameId,
          participantId: participant.id,
        },
      });

      return res.status(201).send();
    }
  );
}
