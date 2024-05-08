type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-lg p-10 bg-white rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
