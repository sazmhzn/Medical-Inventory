import { Button } from "@/components/ui/button";

const PasswordStep = ({ password, setPassword, onSubmit }: any) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="mt-2.5">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
          className="block w-full p-4 text-black placeholder-gray-500 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600"
        />
      </div>
      <Button className="w-full bg-blue-600 text-white" type="submit">
        Login
      </Button>
    </form>
  );
};

export default PasswordStep;
