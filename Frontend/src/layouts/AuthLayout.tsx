import { toast } from "@/hooks/use-toast";
import AuthPage from "@/pages/auth/AuthPage";
import { useAuth } from "@/services/authApi";
import { useAuthState } from "@/utils/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const { loginMutation, registerMutation } = useAuth();
  const { user, isAuthenticated } = useAuthState();

  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        role: formData.role,
        authMethod: "password",
      });
      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting to admin dashboard...",
      });
      navigate("/admin");
    } catch (error) {
      toast({
        title: "Login Failed",
        description:
          error.response?.data?.message ||
          "An error occurred while logging in.",
        variant: "destructive",
      });
      console.error("Login failed:", error);
    }
  };

  // Example usage for protected content

  const handleRegister = async (formData) => {
    try {
      await registerMutation.mutateAsync({
        emailAddress: formData.emailAddress,
        username: formData.username,
        address: formData.address,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        name: formData.fullName,
        role: formData.role,
        orgName: formData.companyName,
      });
      toast({
        title: "Registration Successful",
        description: "Your account has been created.",
      });
      navigate("/admin");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message || "Unable to register. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendOtp = async (email, role) => {
    // await authService.sendOtp({ email, role });
    console.log("in handleSendOtp");
  };

  if (!isAuthenticated) {
    console.log("authenticate first");
  }

  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex min-h-screen items-center justify-center px-4 py-10 a sm:px-6 lg:px-8 sm:py-16 lg:py-24">
          {/* <Outlet /> */}
          <AuthPage
            onLogin={handleLogin}
            onRegister={handleRegister}
            onSendOtp={handleSendOtp}
          />
        </div>

        <div className="flex items-center justify-center px-4 py-10 sm:py-16 lg:py-24 bg-gray-50 sm:px-6 lg:px-8">
          <div>
            <img
              className="w-full mx-auto"
              src="https://cdn.rareblocks.xyz/collection/celebration/images/signup/1/cards.png"
              alt=""
            />

            <div className="w-full max-w-md mx-auto xl:max-w-xl">
              <h3 className="text-2xl font-bold text-center text-black">
                Design your own card
              </h3>
              <p className="leading-relaxed text-center text-gray-500 mt-2.5">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                amet sint. Velit officia consequat duis.
              </p>

              <div className="flex items-center justify-center mt-10 space-x-3">
                <div className="bg-orange-500 rounded-full w-20 h-1.5" />

                <div className="bg-gray-200 rounded-full w-12 h-1.5" />

                <div className="bg-gray-200 rounded-full w-12 h-1.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
