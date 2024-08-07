import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import db from "./db/db";

declare module "next-auth" {
  interface Session {
    user: {
      role: "admin" | "user";
      emailVerified: Date | null;
    } & DefaultSession["user"];
  }
}

type userRole = "admin" | "user";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && token.role) {
        session.user.role = token.role as userRole;
      }

      if (session.user && token.emailVerified) {
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      if (session.user && token.name) {
        session.user.name = token.name as string;
      }
      if (session.user && token.email) {
        session.user.email = token.email as string;
      }
      if (session.user && token.image) {
        session.user.image = token.image as string;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await db.user.findUnique({
        where: { id: token.sub },
        select: {
          role: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
        },
      });

      if (!user) return token;

      token.role = user.role;
      token.emailVerified = user.emailVerified;
      token.name = user.name;
      token.email = user.email;
      token.image = user.image;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
