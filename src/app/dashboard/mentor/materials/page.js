import { prisma } from "@/lib/prisma";
import { requireMentor } from "@/actions/mentor";
import MaterialsClient from "./MaterialsClient";

export default async function MentorMaterialsPage() {
  const { dbUser } = await requireMentor();
  const trackIds = dbUser.mentorTracks.map(t => t.id);

  const materials = await prisma.material.findMany({
    where: { trackId: { in: trackIds } },
    include: { track: true, uploadedBy: true },
    orderBy: { createdAt: "desc" }
  });

  const tracks = dbUser.mentorTracks.map(t => ({ id: t.id, title: t.title }));

  return <MaterialsClient materials={materials} tracks={tracks} mentorId={dbUser.id} />;
}
