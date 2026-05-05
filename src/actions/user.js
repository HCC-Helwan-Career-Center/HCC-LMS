"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      universityId: true,
      phone: true,
      academicYear: true,
      department: true,
      github: true,
      linkedin: true,
    }
  });

  return user;
}

export async function updateUserProfile(data) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Not authenticated" };
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: data.name,
        phone: data.phone,
        universityId: data.universityId,
        academicYear: data.academicYear,
        department: data.department,
        github: data.github,
        linkedin: data.linkedin,
        // Note: we generally shouldn't allow changing email here without verification
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { error: "Failed to update profile" };
  }
}
