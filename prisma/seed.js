import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed tracks
  const tracks = [
    { slug: "ai", title: "Artificial Intelligence", color: "#8B5CF6", description: "Master Machine Learning and AI." },
    { slug: "cybersecurity", title: "Cybersecurity", color: "#10B981", description: "Learn network security, ethical hacking." },
    { slug: "swe", title: "Software Engineering", color: "#3B82F6", description: "Full stack development and system design." },
  ];

  for (const track of tracks) {
    await prisma.track.upsert({
      where: { slug: track.slug },
      update: {},
      create: track,
    });
  }
  console.log("✅ Seeded tracks successfully.");

  // Seed admin user
  const adminPassword = await bcrypt.hash("Admin@1234", 10);
  await prisma.user.upsert({
    where: { email: "admin@hcc.edu" },
    update: { role: "admin" },
    create: {
      name: "HCC Admin",
      email: "admin@hcc.edu",
      password: adminPassword,
      role: "admin",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Seeded admin user (admin@hcc.edu / Admin@1234).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
