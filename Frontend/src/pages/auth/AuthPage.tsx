import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock email verification
    if (email) {
      setStep("otp");
    } else {
      alert("Please enter a valid email.");
    }
  };
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock email verification
    if (email) {
      setStep("password");
    } else {
      alert("Please enter a valid otp.");
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password verification
    if (password) {
      // Assuming successful login
      navigate("/");
    } else {
      alert("Please enter your password.");
    }
  };

  return (
    <div className="xl:w-full text-center xl:max-w-sm 2xl:max-w-md xl:mx-auto">
      <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl mb-5">
        Create new Account
      </h2>
      {/* <p className="mt-2 text-base text-gray-600">
        Don’t have an account?{" "}
        <a
          href="#"
          title=""
          className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 hover:underline focus:text-blue-700"
        >
          Create a free account
        </a>
      </p> */}

      <div className="space-y-5">
        <div>
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="mt-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter email to get started"
                  className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                />
              </div>

              <Button
                className="inline-flex items-center justify-center w-full px-4 py-6 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700"
                type="submit"
              >
                Next
              </Button>
            </form>
          )}
        </div>

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="mt-2.5">
              <InputOTP
                className="w-full "
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              >
                <InputOTPGroup className=" w-full">
                  <InputOTPSlot
                    className="w-full aspect-square h-12"
                    index={0}
                  />
                  <InputOTPSlot
                    className="w-full aspect-square h-12"
                    index={1}
                  />
                  <InputOTPSlot
                    className="w-full aspect-square h-12"
                    index={2}
                  />
                  <InputOTPSlot
                    className="w-full aspect-square h-12"
                    index={3}
                  />
                  <InputOTPSlot
                    className="w-full aspect-square h-12"
                    index={4}
                  />
                  <InputOTPSlot
                    className="w-full aspect-square h-12"
                    index={5}
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              className="inline-flex items-center justify-center w-full px-4 py-6 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700"
              type="submit"
            >
              Login
            </Button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="mt-2.5">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
              />
            </div>

            <Button
              className="inline-flex items-center justify-center w-full px-4 py-6 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700"
              type="submit"
            >
              Login
            </Button>
          </form>
        )}
      </div>

      <div className="mt-3 space-y-3">
        <Button
          variant="outline"
          className="relative inline-flex items-center justify-center w-full px-4 py-6 text-base font-semibold text-gray-700 transition-all duration-200 bg-white border-2 border-gray-200 rounded-md hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black focus:outline-none"
        >
          <div className="absolute inset-y-0 left-0 p-4">
            <svg
              className="w-6 h-6 text-neutral-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" />
            </svg>
          </div>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default AuthPage;
