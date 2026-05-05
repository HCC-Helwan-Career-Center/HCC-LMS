"use server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// TODO: Re-enable email verification before production launch

export async function registerUser(formData) {
  try {
    const { name, universityId, track, password } = formData;
    const email = formData.email?.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User with this email already exists." };
    }

    // Validate track exists before creating the user
    const trackRecord = await prisma.track.findUnique({
      where: { slug: track },
    });

    if (!trackRecord) {
      return {
        error: `Track "${track}" does not exist. Please run: npx prisma db seed`,
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with emailVerified set immediately (verification disabled)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        universityId,
        password: hashedPassword,
        role: "student",
        emailVerified: new Date(),
      },
    });

    // Enrol user in track
    await prisma.enrollment.create({
      data: {
        userId: newUser.id,
        trackId: trackRecord.id,
      },
    });

    return { success: true, email };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong during registration." };
  }
}
