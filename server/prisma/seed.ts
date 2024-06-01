import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.create({
    data: {
      name: "johnDoe",
      email: "test@prisma.io",
      avatarUrl: "https://github.com/linkzera.png",
    },
  });

  const pool = await prisma.pool.create({
    data: {
      title: "Example Pool",
      code: "BOL123",
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-02T12:00:00.783Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "AR",
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-03T12:00:00.783Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "DE",
      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 2,
          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              },
            },
          },
        },
      },
    },
  });
}

main();
