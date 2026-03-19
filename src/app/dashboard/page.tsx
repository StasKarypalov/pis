import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const role = (session.user as any)?.role as string | undefined;

  if (role === "MANAGER") redirect("/dashboard/admin?tab=pending");
  if (role === "EMPLOYEE") redirect("/dashboard/employee?tab=upcoming");
  redirect("/dashboard/pending");
}

