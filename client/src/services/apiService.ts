import axios from "axios";

interface RegisterUserFields {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (fields: RegisterUserFields) => {
  console.log("fields", fields);
  try {
    const response = await api.post("/auth/register", {
      ...fields,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
