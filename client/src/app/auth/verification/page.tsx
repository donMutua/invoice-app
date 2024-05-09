"use client";
import { type FC } from "react";
import { RocketIcon } from "@radix-ui/react-icons";
import { useAppSelector } from "@/redux/hooks/useAppSelector";

useAppSelector;

const Verification: FC = () => {
  const email = useAppSelector((state) => state.verifyEmail.email);
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <RocketIcon
        className="w-20 h-20 text-primary"
        style={{ color: "#5e3d84" }}
      />
      <h1 className="text-md  text-center ">
        We have sent you a verification email to{" "}
        <span className="font-semibold" style={{ color: "#5e3d84" }}>
          {email}
        </span>
        . Please check your inbox and click on the link to verify your account.
      </h1>
    </div>
  );
};

export default Verification;
