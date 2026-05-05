import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MentorLayout from "@/components/mentor/MentorLayout";

export default async function MentorDashboardLayout({ children }) {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (user?.role !== "mentor") {
    redirect("/dashboard");
  }

  return (
    <MentorLayout user={session.user}>
      {children}
    </MentorLayout>
  );
}
