import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NoPage = () => {
  return (
    <div className="w-100 flex flex-col items-center gap-14 justify-center min-h-[100dvh]">
      <iframe
        src="https://lottie.host/embed/fdd3c5d1-cdec-423a-939d-432495ec2aae/kEFZEFV1oQ.lottie"
        className="bg-gray-100 rounded-md scale-150 mx-auto"
      />

      <Button className="whitespace-nowrap rounded-lg bg-slate-900 px-4 py-2 font-medium text-white shadow-xl transition-colors hover:bg-slate-700">
        <Link to={"/admin"}>Back to home</Link>
      </Button>
    </div>
  );
};

export default NoPage;
