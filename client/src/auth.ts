import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

async function loginUser(email: string, password: string): Promise<any> {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/v1/auth/login",
      {
        email,
        password,
      }
    );

    console.log("resonnse", response.data);
    return response.data;
  } catch (error: any) {
    //catch error
    console.log("errorAPI", error.response.data);
    return error.response.data;
  }
}

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await loginUser(
            credentials.email as string,
            credentials.password as string
          );
          if (response.error) {
            throw new Error(response.error);
          }
          return response;
        } catch (error) {
          console.error(error);

          return { error: "Login failed due to an error." };
        }
      },
    }),
  ],
});
