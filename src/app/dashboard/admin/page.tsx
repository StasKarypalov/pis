import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminDashboard } from "@/components/dashboard/admin/AdminDashboard";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const role = ((session.user as any)?.role as string | undefined) ?? "PENDING";
  if (role !== "MANAGER") redirect("/dashboard/pending");

  return <AdminDashboard />;
}

