import { prisma } from "@/lib/prisma";
import { requireMentor } from "@/actions/mentor";
import SessionsClient from "./SessionsClient";

export default async function MentorSessionsPage() {
  const { dbUser } = await requireMentor();
  const trackIds = dbUser.mentorTracks.map(t => t.id);

  const sessions = await prisma.learningSession.findMany({
    where: { trackId: { in: trackIds } },
    include: { track: true, mentor: true },
    orderBy: { date: "asc" }
  });

  const tracks = dbUser.mentorTracks.map(t => ({ id: t.id, title: t.title }));

  return <SessionsClient sessions={sessions} tracks={tracks} mentorId={dbUser.id} />;
}
