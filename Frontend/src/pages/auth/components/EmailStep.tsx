import React from "react";
import { Button } from "@/components/ui/button";

const EmailStep = ({ email, setEmail, onNext }: any) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onNext();
    } else {
      alert("Please enter a valid email.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mt-2.5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter email to get started"
          className="block w-full p-4 text-black placeholder-gray-500 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600"
        />
      </div>
      <Button className="w-full bg-blue-600 text-white" type="submit">
        Next
      </Button>
    </form>
  );
};

export default EmailStep;
