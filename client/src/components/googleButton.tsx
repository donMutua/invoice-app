import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

type GoogleButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick, children }) => {
  return (
    <Button
      type="button"
      className="w-full hover:bg-white bg-white border border-gray-300 text-gray-800 p-5 mt-5"
      onClick={onClick}
    >
      <Image
        src="/google-icon.svg"
        alt="Google Icon"
        width={20}
        height={20}
        className="mr-2"
      />
      {children}
    </Button>
  );
};

export default GoogleButton;
