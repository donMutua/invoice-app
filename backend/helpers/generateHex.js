import { randomBytes } from "crypto";

// Helper function to generate a random token

export const generateHex = () => {
  return randomBytes(32).toString("hex");
};
