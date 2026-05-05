"use server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// ---------- helpers ----------

function buildVerifyLink(token, email) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Fix #7: Warn if NEXT_PUBLIC_APP_URL is missing in production
  if (!process.env.NEXT_PUBLIC_APP_URL && process.env.NODE_ENV === "production") {
    console.warn(
      "⚠️  NEXT_PUBLIC_APP_URL is not set. Verification links will point to http://localhost:3000. " +
      "Set this env var to your production URL."
    );
  }

  return `${baseUrl}/verify?token=${token}&email=${encodeURIComponent(email)}`;
}

/**
 * Build the verification HTML email body.
 */
function buildEmailHtml(name, verifyLink) {
  return `
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
  `;
}

/**
 * Send (or mock) a verification email.
 * Returns { success, mockedEmail?, mockedLink? } or { error }.
 */
async function sendVerificationEmail(email, name, verifyLink) {
  if (resend) {
    // Fix #4: onboarding@resend.dev only delivers to the Resend account owner's
    // email during testing. Once you verify a custom domain in the Resend dashboard,
    // replace this with your verified sender (e.g. "noreply@helwancareercenter.com").
    const { error } = await resend.emails.send({
      from: "HCC Platform <onboarding@resend.dev>",
      to: email,
      subject: "Verify your HCC Account",
      html: buildEmailHtml(name, verifyLink),
    });

    if (error) {
      console.error("Resend API error:", error);
      // Fix #4b: Don't fail the whole registration — user is already created.
      // Log the error and still return success so the user can request a resend.
      return { success: true, emailFailed: true };
    }

    return { success: true };
  }

  // Mock email for dev when Resend is not configured
  console.log("-----------------------------------------");
  console.log("📧 MOCK EMAIL SENT");
  console.log(`To: ${email}`);
  console.log(`Body: Click here to verify: ${verifyLink}`);
  console.log("-----------------------------------------");

  return {
    success: true,
    mockedEmail: true,
    mockedLink: process.env.NODE_ENV === "development" ? verifyLink : null,
  };
}

// ---------- actions ----------

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

    // Fix #5: Validate track exists BEFORE creating the user
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

    // Enrol user in track
    await prisma.enrollment.create({
      data: {
        userId: newUser.id,
        trackId: trackRecord.id,
      },
    });

    // Send Verification Email
    const verifyLink = buildVerifyLink(token, email);
    const emailResult = await sendVerificationEmail(email, name, verifyLink);

    return {
      success: true,
      email,
      ...(emailResult.mockedEmail && { mockedEmail: true }),
      ...(emailResult.mockedLink && { mockedLink: emailResult.mockedLink }),
      ...(emailResult.emailFailed && { emailFailed: true }),
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong during registration." };
  }
}

// Fix #6: Real resend verification email action
export async function resendVerificationEmail(email) {
  try {
    if (!email) {
      return { error: "Email is required." };
    }

    // Check user exists and is unverified
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "No account found with this email." };
    }

    if (user.emailVerified) {
      return { error: "This email is already verified. You can log in." };
    }

    // Delete any existing verification tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Create a fresh token with 24h expiry
    const token = randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Send the email
    const verifyLink = buildVerifyLink(token, email);
    const emailResult = await sendVerificationEmail(email, user.name || "Student", verifyLink);

    if (emailResult.emailFailed) {
      return { error: "Failed to send verification email. Please try again later." };
    }

    return {
      success: true,
      ...(emailResult.mockedEmail && { mockedEmail: true }),
      ...(emailResult.mockedLink && { mockedLink: emailResult.mockedLink }),
    };
  } catch (error) {
    console.error("Resend verification error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
