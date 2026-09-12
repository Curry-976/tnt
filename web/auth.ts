import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // The site runs behind an nginx reverse proxy (see DEPLOY.md); without
  // this, Auth.js rejects every request with "UntrustedHost" because the
  // Host header it sees doesn't match what it expects from a direct
  // connection. nginx is trusted here since it's ours and only forwards the
  // real client's X-Forwarded-* headers, not attacker-controlled ones.
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/compte" },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        // No passwordHash means the account was created via Google — it has
        // no password to compare against.
        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: String(user.id), email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      const email = user.email?.trim().toLowerCase();
      if (!email) return false;

      // No DB adapter is configured (JWT-only sessions), so Google sign-ins
      // are linked to our own users table by email here, creating the row
      // on first login. This keeps a single stable internal user id that
      // orders.userId already relies on, regardless of how someone signs in.
      const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existing) {
        user.id = String(existing.id);
        // Backfill the name for accounts created before this field existed.
        if (!existing.name && user.name) {
          await db.update(users).set({ name: user.name }).where(eq(users.id, existing.id));
        } else {
          user.name = existing.name;
        }
      } else {
        const [created] = await db.insert(users).values({ email, name: user.name }).returning();
        user.id = String(created.id);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) session.user.id = token.uid as string;
      if (session.user) session.user.name = (token.name as string | null) ?? null;
      return session;
    },
  },
});
