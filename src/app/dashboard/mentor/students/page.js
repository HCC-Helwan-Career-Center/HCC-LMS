import { prisma } from "@/lib/prisma";
import { requireMentor } from "@/actions/mentor";
import StudentsClient from "./StudentsClient";

export default async function MentorStudentsPage() {
  const { dbUser } = await requireMentor();
  const trackIds = dbUser.mentorTracks.map(t => t.id);

  // Fetch all students enrolled in these tracks
  const enrollments = await prisma.enrollment.findMany({
    where: { trackId: { in: trackIds } },
    include: {
      user: true,
      track: true
    },
    orderBy: { createdAt: "desc" }
  });

  // Extract unique students and their related tracks/progress
  const studentMap = new Map();
  enrollments.forEach(e => {
    if (!studentMap.has(e.userId)) {
      studentMap.set(e.userId, {
        id: e.user.id,
        name: e.user.name,
        email: e.user.email,
        universityId: e.user.universityId,
        createdAt: e.user.createdAt.toLocaleDateString(),
        tracks: []
      });
    }
    studentMap.get(e.userId).tracks.push({
      id: e.track.id,
      title: e.track.title,
      progress: e.progress,
      enrolledAt: e.createdAt.toLocaleDateString()
    });
  });

  const students = Array.from(studentMap.values());
  const tracks = dbUser.mentorTracks.map(t => ({ id: t.id, title: t.title }));

  return <StudentsClient students={students} tracks={tracks} />;
}
