"use server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function registerUser(formData) {
  try {
    const { name, email, universityId, track, password } = formData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User with this email already exists." };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        universityId,
        password: hashedPassword,
        role: "student",
      },
    });

    // Create a verification token
    const token = randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Enrol user in track if exists
    // Normally we should look up track by slug and create enrollment
    const trackRecord = await prisma.track.findUnique({
      where: { slug: track },
    });

    if (trackRecord) {
      await prisma.enrollment.create({
        data: {
          userId: newUser.id,
          trackId: trackRecord.id,
        },
      });
    }

    // Send Verification Email
    const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify?token=${token}&email=${encodeURIComponent(email)}`;

    if (resend) {
      const { data, error } = await resend.emails.send({
        from: 'HCC Platform <onboarding@resend.dev>', // Resend requires this for testing unless domain is verified
        to: email, // Note: In testing, this MUST be the email registered with your Resend account
        subject: "Verify your HCC Account",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #E8871E;">Welcome to HCC!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for registering. Please click the button below to verify your email address and activate your account.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyLink}" style="background-color: #E8871E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Account</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666; font-size: 14px;">${verifyLink}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #999;">If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend API error:", error);
        return { error: "Failed to send verification email. (Resend error)" };
      }

      return { success: true, email };
    } else {
      // Mock email for dev if Resend is not configured
      console.log("-----------------------------------------");
      console.log("📧 MOCK EMAIL SENT");
      console.log(`To: ${email}`);
      console.log(`Body: Click here to verify: ${verifyLink}`);
      console.log("-----------------------------------------");

      return {
        success: true,
        email,
        mockedEmail: true,
        mockedLink: process.env.NODE_ENV === "development" ? verifyLink : null
      };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong during registration." };
  }
}
