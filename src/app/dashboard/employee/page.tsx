import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EmployeeDashboard } from "@/components/dashboard/employee/EmployeeDashboard";

export default async function EmployeePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const role = ((session.user as any)?.role as string | undefined) ?? "PENDING";
  if (role !== "EMPLOYEE") redirect("/dashboard/pending");

  return <EmployeeDashboard />;
}

