import Image from "next/image";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col  items-center justify-center w-full h-20 ">
        <Image
          src="/finchwised.png"
          width={200}
          height={200}
          alt="finchwise logo"
          className="rounded-sm"
        />
      </div>
      <div className="flex flex-col items-center justify-center w-full px-4 py-8 sm:px-0 sm:max-w-lg">
        <div className="w-full p-12 bg-white rounded-lg shadow-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
