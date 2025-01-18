import HeaderTitle from "@/components/commons/header-title";
import { Outlet } from "react-router-dom";

const ReportLayout = () => {
  return (
    <div className="w-full">
      {" "}
      <HeaderTitle title="Report" />
      <Outlet />
    </div>
  );
};

export default ReportLayout;
