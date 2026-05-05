import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
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
  console.log("Seeded tracks successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
