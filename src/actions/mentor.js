"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ---- Helpers ----

export async function requireMentor() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { mentorTracks: true },
  });
  
  if (user?.role !== "mentor") throw new Error("Not authorized");
  return { ...session, dbUser: user };
}

function verifyMentorTrack(dbUser, trackId) {
  if (!dbUser.mentorTracks.some(t => t.id === trackId)) {
    throw new Error("You are not assigned to this track");
  }
}

// ---- Students & Notes ----

export async function addMentorNote(studentId, content) {
  const { dbUser } = await requireMentor();
  
  try {
    await prisma.mentorNote.create({
      data: {
        mentorId: dbUser.id,
        studentId,
        content,
      },
    });
    revalidatePath("/dashboard/mentor/students");
    return { success: true };
  } catch (error) {
    console.error("Failed to add note:", error);
    return { error: "Failed to add note." };
  }
}

// ---- Materials ----

export async function uploadMaterial(data) {
  const { dbUser } = await requireMentor();
  verifyMentorTrack(dbUser, data.trackId);

  try {
    await prisma.material.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        url: data.url,
        trackId: data.trackId,
        uploadedById: dbUser.id,
      },
    });
    revalidatePath("/dashboard/mentor/materials");
    return { success: true };
  } catch (error) {
    console.error("Failed to upload material:", error);
    return { error: "Failed to upload material." };
  }
}

export async function deleteMaterial(id) {
  const { dbUser } = await requireMentor();

  try {
    const mat = await prisma.material.findUnique({ where: { id } });
    if (!mat || mat.uploadedById !== dbUser.id) {
      return { error: "Not authorized to delete this material." };
    }
    
    await prisma.material.delete({ where: { id } });
    revalidatePath("/dashboard/mentor/materials");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete material:", error);
    return { error: "Failed to delete material." };
  }
}

// ---- Sessions ----

export async function scheduleSession(data) {
  const { dbUser } = await requireMentor();
  verifyMentorTrack(dbUser, data.trackId);

  try {
    await prisma.learningSession.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        durationMinutes: parseInt(data.durationMinutes, 10),
        type: data.type,
        meetingLink: data.meetingLink || null,
        location: data.location || null,
        trackId: data.trackId,
        mentorId: dbUser.id,
        status: "UPCOMING",
      },
    });
    revalidatePath("/dashboard/mentor/sessions");
    return { success: true };
  } catch (error) {
    console.error("Failed to schedule session:", error);
    return { error: "Failed to schedule session." };
  }
}

export async function updateSession(id, data) {
  const { dbUser } = await requireMentor();
  
  try {
    const session = await prisma.learningSession.findUnique({ where: { id } });
    if (!session || session.mentorId !== dbUser.id) {
      return { error: "Not authorized to update this session." };
    }

    await prisma.learningSession.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        durationMinutes: parseInt(data.durationMinutes, 10),
        type: data.type,
        meetingLink: data.meetingLink || null,
        location: data.location || null,
      },
    });
    revalidatePath("/dashboard/mentor/sessions");
    return { success: true };
  } catch (error) {
    console.error("Failed to update session:", error);
    return { error: "Failed to update session." };
  }
}

export async function deleteSession(id) {
  const { dbUser } = await requireMentor();

  try {
    const session = await prisma.learningSession.findUnique({ where: { id } });
    if (!session || session.mentorId !== dbUser.id) {
      return { error: "Not authorized to delete this session." };
    }

    await prisma.learningSession.delete({ where: { id } });
    revalidatePath("/dashboard/mentor/sessions");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete session:", error);
    return { error: "Failed to delete session." };
  }
}

export async function markSessionCompleted(id) {
  const { dbUser } = await requireMentor();

  try {
    const session = await prisma.learningSession.findUnique({ where: { id } });
    if (!session || session.mentorId !== dbUser.id) {
      return { error: "Not authorized to modify this session." };
    }

    await prisma.learningSession.update({
      where: { id },
      data: { status: "COMPLETED" },
    });
    revalidatePath("/dashboard/mentor/sessions");
    return { success: true };
  } catch (error) {
    console.error("Failed to complete session:", error);
    return { error: "Failed to complete session." };
  }
}

// ---- Announcements ----

export async function createMentorAnnouncement(data) {
  const { dbUser } = await requireMentor();
  // Mentor must target a specific track they are assigned to
  verifyMentorTrack(dbUser, data.targetId);

  try {
    // We store the track slug in 'target' to align with the Announcement schema 
    // target can be 'all' or track slug. Let's find the track slug.
    const track = await prisma.track.findUnique({ where: { id: data.targetId } });
    
    await prisma.announcement.create({
      data: {
        title: data.title,
        body: data.body,
        target: track.slug,
        authorId: dbUser.id,
      },
    });
    revalidatePath("/dashboard/mentor/announcements");
    return { success: true };
  } catch (error) {
    console.error("Failed to create announcement:", error);
    return { error: "Failed to create announcement." };
  }
}

export async function deleteMentorAnnouncement(id) {
  const { dbUser } = await requireMentor();

  try {
    const ann = await prisma.announcement.findUnique({ where: { id } });
    if (!ann || ann.authorId !== dbUser.id) {
      return { error: "Not authorized to delete this announcement." };
    }

    await prisma.announcement.delete({ where: { id } });
    revalidatePath("/dashboard/mentor/announcements");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete announcement:", error);
    return { error: "Failed to delete announcement." };
  }
}
