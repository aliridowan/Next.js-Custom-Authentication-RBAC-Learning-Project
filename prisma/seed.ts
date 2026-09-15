import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "../app/generated/prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  const password = await bcrypt.hash("12345678", 10);

  // Teams
  const engineering = await prisma.team.upsert({
    where: {
      code: "ENG001",
    },
    update: {},
    create: {
      name: "Engineering",
      code: "ENG001",
      description: "Engineering Team",
    },
  });

  const marketing = await prisma.team.upsert({
    where: {
      code: "MKT001",
    },
    update: {},
    create: {
      name: "Marketing",
      code: "MKT001",
      description: "Marketing Team",
    },
  });

  const design = await prisma.team.upsert({
    where: {
      code: "DSN001",
    },
    update: {},
    create: {
      name: "Design",
      code: "DSN001",
      description: "Design Team",
    },
  });

  // Users

  await prisma.user.upsert({
    where: {
      email: "admin@example.com",
    },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@example.com",
      password,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: {
      email: "manager1@example.com",
    },
    update: {},
    create: {
      name: "Engineering Manager",
      email: "manager1@example.com",
      password,
      role: Role.MANAGER,
      teamId: engineering.id,
    },
  });

  await prisma.user.upsert({
    where: {
      email: "manager2@example.com",
    },
    update: {},
    create: {
      name: "Marketing Manager",
      email: "manager2@example.com",
      password,
      role: Role.MANAGER,
      teamId: marketing.id,
    },
  });

  await prisma.user.createMany({
    data: [
      {
        name: "Alice",
        email: "alice@example.com",
        password,
        role: Role.USER,
        teamId: engineering.id,
      },
      {
        name: "Bob",
        email: "bob@example.com",
        password,
        role: Role.USER,
        teamId: engineering.id,
      },
      {
        name: "Charlie",
        email: "charlie@example.com",
        password,
        role: Role.USER,
        teamId: marketing.id,
      },
      {
        name: "David",
        email: "david@example.com",
        password,
        role: Role.USER,
        teamId: design.id,
      },
      {
        name: "Guest User",
        email: "guest@example.com",
        password,
        role: Role.GUEST,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });



// import "dotenv/config";
// import { Pool } from "pg";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { Prisma, PrismaClient } from "../app/generated/prisma/client";
//
// // const connectionString = `${process.env.DATABASE_URL}`;
// // const pool = new Pool({ connectionString });
// // const adapter = new PrismaPg(pool);
// const prisma = new PrismaClient({ adapter });
// async function main() {
//   console.log("seedding is starting......")
//   // Create Team 
//   const team = await Promise.all({
//     prisma.team.Create({
//       date: {
//
//       }
//     })
//   }) 
//
// }
// main()
//   // .then(async () => {
//   //   await prisma.$disconnect();
//   //   await pool.end();
//   // })
//   .catch(async (e) => {
//     console.error("seedding failed",e);
//     // await prisma.$disconnect();
//     // await pool.end();
//     process.exit(1);
//   }).finally(async ()=> { await prisma.$disconnect()})



