import HeaderTitle from "@/components/header-title";
import { Input } from "@/components/ui/input";

import { Search } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="w-full ">
      <HeaderTitle />
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-8" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
