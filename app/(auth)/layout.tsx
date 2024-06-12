interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-170px)] border">
      {children}
    </div>
  );
};

export default AuthLayout;
