const { hash } = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("12345", 10);

  await prisma.user.upsert({
    where: { email: "manager" },
    update: {
      role: "MANAGER",
      passwordHash
    },
    create: {
      email: "manager",
      role: "MANAGER",
      passwordHash,
      name: "Default Manager"
    }
  });

  // eslint-disable-next-line no-console
  console.log("Default manager ensured: email=manager, password=12345");
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

