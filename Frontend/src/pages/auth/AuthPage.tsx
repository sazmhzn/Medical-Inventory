import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

// Types
type AuthMethod = "password" | "otp";
type AuthTab = "login" | "register";

enum UserRole {
  SUPER_ADMIN = "ROLE_SUPER_ADMIN",
  INVENTORY_MANAGER = "ROLE_ADMIN",
  SUPPLIER = "ROLE_SUPPLIER",
  CUSTOMER = "ROLE_CUSTOMER",
}

interface LoginFormData {
  email: string;
  password?: string;
  otp?: string;
  role: UserRole;
  authMethod: AuthMethod;
}

interface RegistrationFormData {
  emailAddress: string;
  username: string;
  password: string;
  contact?: string;
  confirmPassword: string;
  address: string;
  fullName: string;
  role: UserRole;
  companyName?: string;
}

interface AuthPageProps {
  onLogin: (data: LoginFormData) => Promise<void>;
  onRegister: (data: RegistrationFormData) => Promise<void>;
  onSendOtp: (email: string, role: UserRole) => Promise<void>;
}

// Validation functions
const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
  return null;
};

const validatePassword = (
  password: string,
  isRequired: boolean
): string | null => {
  if (isRequired && !password) return "Password is required";
  if (password && password.length < 8)
    return "Password must be at least 8 characters";
  if (password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return "Password must contain uppercase, lowercase, and numbers";
  }
  return null;
};

const validateOtp = (
  otp: string | undefined,
  isRequired: boolean
): string | null => {
  if (isRequired && !otp) return "OTP is required";
  if (otp && !/^\d{6}$/.test(otp)) return "OTP must be 6 digits";
  return null;
};

const AuthPage = ({ onLogin, onRegister, onSendOtp }: AuthPageProps) => {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
    role: UserRole.INVENTORY_MANAGER,
    authMethod: "password",
  });

  // Registration form state
  const [registerData, setRegisterData] = useState<RegistrationFormData>({
    emailAddress: "",
    username: "",
    password: "",
    address: "",
    contact: "",
    confirmPassword: "",
    fullName: "",
    role: UserRole.CUSTOMER,
    companyName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setIsLoading(true);
    try {
      await onLogin(loginData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setIsLoading(true);
    try {
      await onRegister(registerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!validateEmail(loginData.email)) return;

    setLoginData((prev) => {
      return {
        ...prev,
        authMethod: "otp",
      };
    });

    setIsLoading(true);
    try {
      await onSendOtp(loginData.email, loginData.role);
      setOtpSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as AuthTab)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="p-6 space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <Input
                type="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Authentication Method
              </label>
              <select
                value={loginData.authMethod}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    authMethod: e.target.value as AuthMethod,
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="password">Password</option>
                <option value="otp">OTP</option>
              </select>
            </div>

            {loginData.authMethod === "password" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={loginData.password || ""}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            )}

            {loginData.authMethod === "otp" && (
              <>
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={!loginData.email || otpSent || isLoading}
                  className="w-full"
                >
                  {otpSent ? "OTP Sent" : "Send OTP"}
                </Button>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">OTP</label>
                  <Input
                    type="text"
                    maxLength={6}
                    value={loginData.otp || ""}
                    onChange={(e) =>
                      setLoginData({ ...loginData, otp: e.target.value })
                    }
                    className={errors.otp ? "border-red-500" : ""}
                  />
                  {errors.otp && (
                    <p className="text-sm text-red-500">{errors.otp}</p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium">Role</label>
              <select
                value={loginData.role}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    role: e.target.value as UserRole,
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value={UserRole.INVENTORY_MANAGER}>
                  Inventory Manager
                </option>
                <option value={UserRole.SUPPLIER}>Supplier</option>
                <option value={UserRole.CUSTOMER}>Customer</option>
              </select>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="register" className="p-6 space-y-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Full Name</label>
              <Input
                value={registerData.fullName}
                onChange={(e) =>
                  setRegisterData({ ...registerData, fullName: e.target.value })
                }
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Username</label>
              <Input
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData({ ...registerData, username: e.target.value })
                }
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Company Name</label>
              <Input
                value={registerData.companyName}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    companyName: e.target.value,
                  })
                }
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.companyName && (
                <p className="text-sm text-red-500">{errors.companyName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Address</label>
              <Input
                value={registerData.address}
                onChange={(e) =>
                  setRegisterData({ ...registerData, address: e.target.value })
                }
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <Input
                type="email"
                value={registerData.emailAddress}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    emailAddress: e.target.value,
                  })
                }
                className={errors.emailAddress ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.emailAddress}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Password</label>
              <Input
                type="password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className={
                    errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
                  }
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Role</label>
              <select
                value={registerData.role}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    role: e.target.value as UserRole,
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value={UserRole.CUSTOMER}>Customer</option>
                <option value={UserRole.SUPPLIER}>Supplier</option>
                <option value={UserRole.INVENTORY_MANAGER}>
                  Inventory Manager
                </option>
              </select>
            </div>

            {registerData.role === UserRole.SUPPLIER && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Company Name
                </label>
                <Input
                  value={registerData.companyName}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      companyName: e.target.value,
                    })
                  }
                  className={errors.companyName ? "border-red-500" : ""}
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500">{errors.companyName}</p>
                )}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </Card>
  );
};

export default AuthPage;
