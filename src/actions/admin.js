"use server";

// To create the first admin, run: npx prisma db seed
// Admin credentials: admin@hcc.edu / Admin@1234

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    revalidatePath("/dashboard/admin/users");
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
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { error: "Failed to delete user." };
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
