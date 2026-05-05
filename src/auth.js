import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Fail fast if AUTH_SECRET is missing
if (!process.env.AUTH_SECRET) {
  throw new Error(
    "AUTH_SECRET environment variable is not set. " +
    "Generate one with: openssl rand -base64 32 — then add it to your .env file."
  );
}

class CustomAuthError extends CredentialsSignin {
  constructor(msg) {
    super(msg);
    this.code = msg;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new CustomAuthError("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new CustomAuthError("User not found");
        }

        // TODO: Re-enable email verification before production launch
        // if (!user.emailVerified) {
        //   throw new CustomAuthError("Email not verified");
        // }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new CustomAuthError("Invalid password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
});
