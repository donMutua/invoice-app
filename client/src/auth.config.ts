import type { NextAuthConfig } from "next-auth";

//add session strategy

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/",
    signIn: "auth/login",
    signOut: "/",
  },
  callbacks: {
    authorized({ auth }) {
      console.log("auth object:", auth);
      const isAuthenticated = !!auth?.user;
      console.log("isAuthenticated", isAuthenticated);
      return isAuthenticated;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
