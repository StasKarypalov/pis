import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">Duty Shift Management System</h1>
      {!session && (
        <div className="space-x-4">
          <Link href="/auth/login" className="underline">
            Login
          </Link>
          <Link href="/auth/register" className="underline">
            Employee registration
          </Link>
        </div>
      )}
      {session && (
        <div className="space-y-2">
          <p>Signed in as {session.user?.email}</p>
          <div className="space-x-4">
            <Link href="/dashboard" className="underline">
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

