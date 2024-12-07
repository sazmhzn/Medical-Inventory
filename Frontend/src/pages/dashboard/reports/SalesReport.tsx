import ReportFilter from "./components/ReportFilter";
import ReportHeader from "./components/ReportHeader";
import ReportTable from "./components/ReportTable";

const SalesReport = () => {
  return (
    <section className="rounded-md border">
      <ReportHeader />
      <ReportFilter />
      <ReportTable />
    </section>
  );
};

export default SalesReport;
