import axios, { AxiosInstance } from "axios";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

interface RegisterUserFields {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
}

const createAxiosInstance = async (
  req: Request | undefined
): Promise<AxiosInstance> => {
  const token = req ? await getToken({ req, salt: "", secret: "" }) : null;
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: token?.accessToken ? `Bearer ${token.accessToken}` : ``,
    },
  });
  return instance;
};
