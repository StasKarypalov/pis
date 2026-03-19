import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    Credentials({
      name: "Manager Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await db.user.findUnique({
          where: { email: credentials.email }
        });
        if (!user || !user.passwordHash) return null;
        const isValid = await compare(credentials.password, user.passwordHash);
        if (!isValid) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        } as any;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Ensure our local User table is linked to Google sign-in by email.
      if (account?.provider === "google") {
        const email = (profile as any)?.email ?? (user as any)?.email;
        if (!email) return false;
        const googleId = (profile as any)?.sub ?? (account as any)?.providerAccountId;
        await db.user.upsert({
          where: { email },
          update: {
            googleId,
            // Keep role and calendarToken as-is (registration provides tokens & confirmation).
            name: (user as any)?.name ?? undefined
          },
          create: {
            email,
            name: (user as any)?.name ?? undefined,
            role: "PENDING",
            googleId,
            calendarToken: null
          }
        });
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Credentials provider returns our local user object.
      if (account?.provider === "credentials" && user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.email = (user as any).email;
        return token;
      }

      // Google provider: load role from DB.
      if (account?.provider === "google") {
        const email =
          (user as any)?.email ?? token.email ?? (token as any).email;
        if (email) {
          const dbUser = await db.user.findUnique({ where: { email } });
          token.id = dbUser?.id;
          token.role = dbUser?.role ?? "PENDING";
          token.email = email;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).id;
        (session.user as any).role = (token as any).role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login"
  }
};

