import React from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const OtpStep = ({ onNext }: any) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mt-2.5">
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            {[...Array(6)].map((_, index) => (
              <InputOTPSlot
                key={index}
                className="w-full aspect-square h-12"
                index={index}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button className="w-full bg-blue-600 text-white" type="submit">
        Verify OTP
      </Button>
    </form>
  );
};

export default OtpStep;
