import { AuthError, User, type NextAuthConfig } from "next-auth";
import Creadintials from "next-auth/providers/credentials";
import { logInSchema } from "./zodSchema/authSchema";
import { getUserByEmail } from "./actions/auth.action";
import { compare } from "bcryptjs";
import db from "./db/db";

export default {
  providers: [
    Creadintials({
      async authorize(credentials) {
        const result = logInSchema.safeParse(credentials);

        if (!result.success) return null;

        const { email, password } = result.data;

        const user = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
          },
        });

        if (!user || !user.password) return null;

        const isPasswordMatch = await compare(password, user.password);

        if (isPasswordMatch) return user;

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
