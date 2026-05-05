import DashboardLayout from "@/components/dashboard/DashboardLayout";

export const metadata = {
  title: "Dashboard – HCC",
};

export default function Layout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
