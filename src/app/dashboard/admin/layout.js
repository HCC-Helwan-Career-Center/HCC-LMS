import AdminLayout from "@/components/admin/AdminLayout";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Dashboard – HCC",
};

export default async function Layout({ children }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (user?.role !== "admin") redirect("/dashboard");

  return <AdminLayout>{children}</AdminLayout>;
}
