import { authApi } from '@/services/authApi';
import React, { useState } from 'react'
import { z } from 'zod';
import { login } from './services/authAPI';


const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  
  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    setError("");
    try {
      // Replace with your actual register API
      const user = await authApi.register({
        username: values.email,
        password: values.password,
      });
      login(user); // Auto-login after registration
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>RegisterPage</div>
  )
}

export default RegisterPage