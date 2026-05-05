"use server";

// To create the first admin, run: npx prisma db seed
// Admin credentials: admin@hcc.edu / Admin@1234

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// ---- helpers ----

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true, id: true },
  });
  
  if (user?.role !== "admin") throw new Error("Not authorized");
  return { ...session, dbUser: user };
}

// ---- User Management ----

export async function changeUserRole(userId, newRole) {
  await requireAdmin();
  
  if (!["student", "mentor", "admin"].includes(newRole)) {
    return { error: "Invalid role." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "User not found." };

    let updatedName = user.name || "";
    if (!updatedName.includes("(by admin)")) {
      updatedName = updatedName.trim() + " (by admin)";
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole, name: updatedName },
    });
    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to change role:", error);
    return { error: "Failed to change role." };
  }
}

export async function deleteUser(userId) {
  const { dbUser } = await requireAdmin();
  
  if (dbUser.id === userId) {
    return { error: "Cannot delete your own account." };
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { error: "Failed to delete user." };
  }
}

export async function createUser(data) {
  await requireAdmin();

  try {
    const email = data.email?.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "User with this email already exists." };

    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    let newName = data.name || "";
    if (!newName.includes("(by admin)")) {
      newName = newName.trim() + " (by admin)";
    }

    const newUser = await prisma.user.create({
      data: {
        name: newName,
        email,
        password: hashedPassword,
        role: data.role || "student",
        emailVerified: new Date(),
      },
    });

    if (data.track && data.track !== "none") {
      const track = await prisma.track.findUnique({ where: { slug: data.track } });
      if (track) {
        await prisma.enrollment.create({
          data: {
            userId: newUser.id,
            trackId: track.id,
          },
        });
      }
    }

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { error: "Failed to create user." };
  }
}

// ---- Track Management ----

export async function updateTrack(trackId, data) {
  await requireAdmin();

  try {
    await prisma.track.update({
      where: { id: trackId },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        color: data.color,
      },
    });
    revalidatePath("/dashboard/admin/tracks");
    return { success: true };
  } catch (error) {
    console.error("Failed to update track:", error);
    return { error: "Failed to update track." };
  }
}

export async function enrollUserInTrack(userId, trackSlug) {
  await requireAdmin();

  try {
    const track = await prisma.track.findUnique({ where: { slug: trackSlug } });
    if (!track) return { error: "Track not found." };

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "User not found." };

    if (user.role === "mentor") {
      await prisma.track.update({
        where: { id: track.id },
        data: { mentors: { connect: { id: userId } } }
      });
    } else {
      const existing = await prisma.enrollment.findUnique({
        where: { userId_trackId: { userId, trackId: track.id } }
      });

      if (existing) return { error: "User is already enrolled in this track." };

      await prisma.enrollment.create({
        data: { userId, trackId: track.id }
      });
    }

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to enroll user:", error);
    return { error: "Failed to enroll user." };
  }
}

export async function unenrollUserFromTrack(userId, trackSlug) {
  await requireAdmin();

  try {
    const track = await prisma.track.findUnique({ where: { slug: trackSlug } });
    if (!track) return { error: "Track not found." };

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "User not found." };

    // Clean up both relationships just in case to fix past corrupted data
    await prisma.track.update({
      where: { id: track.id },
      data: { mentors: { disconnect: { id: userId } } }
    });
    
    await prisma.enrollment.deleteMany({
      where: { userId, trackId: track.id }
    });

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to unenroll user:", error);
    return { error: "Failed to unenroll user." };
  }
}

export async function assignMentorToTrack(trackId, mentorId) {
  await requireAdmin();
  try {
    await prisma.track.update({
      where: { id: trackId },
      data: { mentors: { connect: { id: mentorId } } }
    });
    revalidatePath("/dashboard/admin/tracks");
    return { success: true };
  } catch (error) {
    console.error("Failed to assign mentor:", error);
    return { error: "Failed to assign mentor." };
  }
}

export async function removeMentorFromTrack(trackId, mentorId) {
  await requireAdmin();
  try {
    await prisma.track.update({
      where: { id: trackId },
      data: { mentors: { disconnect: { id: mentorId } } }
    });
    revalidatePath("/dashboard/admin/tracks");
    return { success: true };
  } catch (error) {
    console.error("Failed to remove mentor:", error);
    return { error: "Failed to remove mentor." };
  }
}

// ---- Announcements ----

export async function createAnnouncement(data) {
  const { dbUser } = await requireAdmin();

  try {
    await prisma.announcement.create({
      data: {
        title: data.title,
        body: data.body,
        target: data.target || "all",
        authorId: dbUser.id,
      },
    });
    revalidatePath("/dashboard/admin/announcements");
    return { success: true };
  } catch (error) {
    console.error("Failed to create announcement:", error);
    return { error: "Failed to create announcement." };
  }
}

export async function deleteAnnouncement(id) {
  await requireAdmin();

  try {
    await prisma.announcement.delete({ where: { id } });
    revalidatePath("/dashboard/admin/announcements");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete announcement:", error);
    return { error: "Failed to delete announcement." };
  }
}
