import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";

import { Input } from "@/components/ui/input";

interface PasswordInputProps {
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  placeholder: string;
}

const PasswordInput = ({
  showPassword,
  setShowPassword,
  ...props
}: PasswordInputProps) => {
  return (
    <div className="relative w-full">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className="pr-9"
      />
      {showPassword ? (
        <EyeNoneIcon
          type="button"
          className="absolute top-1/2 right-2 transform -translate-y-1/2 w-5 h-5 text-primary"
          onClick={() => setShowPassword(false)}
        />
      ) : (
        <EyeOpenIcon
          type="button"
          className="absolute top-1/2 right-2 transform -translate-y-1/2 w-5 h-5 text-primary"
          onClick={() => setShowPassword(true)}
        />
      )}
    </div>
  );
};

export default PasswordInput;
