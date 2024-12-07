import HeaderTitle from "@/components/commons/header-title";
import { Input } from "@/components/ui/input";
import { Link, Outlet } from "react-router-dom";
import ReportSidebar from "./components/ReportSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, LayoutGrid } from "lucide-react";

const Report = () => {
  return (
    <div className="w-full">
      {" "}
      {/* <HeaderTitle /> */}
      <section className="bg-gray-100">
        <header className="p-6 mt-2  max-w-lg mx-auto text-center">
          <h2 className="text-xl mb-2 font-semibold text-neutral-800">
            Reports Center
          </h2>
          <p className="text-neutral-600 text-md leading-5 mb-4">
            Generate reports on various aspects of your inventory management
            system here.
          </p>
          <Input
            placeholder="Search Reports"
            className="border-2 shadow-none w-full"
          />
        </header>
      </section>
      <section>
        <div className="grid md:grid-cols-[250px_1fr] gap-6 p-6">
          <ReportSidebar />

          <div className="sticky top-5 h-[60vh] overflow-auto">
            <section className="rounded-md border">
              <header className="flex justify-between px-2 py-2">
                <h1 className="text-2xl font-medium">All Reports</h1>
                <div className="inline-flex gap-4 items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" asChild>
                        <Link to={"/"}>
                          <EllipsisVertical className="w-4" />
                        </Link>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-2  shadow-none">
                      <h4 className="flex gap-2 text-neutral-600">
                        {" "}
                        <span>
                          <LayoutGrid className="w-4" />
                        </span>{" "}
                        Layout Configuration
                      </h4>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </header>

              <div className=" relative bg-gray-200 p-2 uppercase text-sm font-medium text-gray-600 border border-y-gray-300">
                <div className="grid grid-cols-3">
                  <p>report name</p>
                  <p>Type</p>
                  <p>Created by</p>
                </div>
              </div>
              <div className="relative ">
                <div className="sticky top-0 bg-white">
                  <div className="bg-gray-200 p-2 uppercase text-base font-medium text-gray-600  border border-y-gray-300">
                    <div className="inline-flex gap-2">
                      <p className="text-neutral-800">Sales</p>
                      <span className="aspect-square p-1 px-2 leading-4 text-[12px] rounded-sm bg-neutral-400">
                        4
                      </span>
                    </div>
                  </div>
                  <div className=" px-2 text-sm font-medium text-neutral-800 border-x">
                    <div className=" py-2 grid grid-cols-3">
                      <Link to={"sales-by-customer"} className="text-blue-600">
                        Sales by Customer
                      </Link>
                      <p>Sales by Customer</p>
                      <p>System Generated</p>
                    </div>
                    <div className=" py-2 grid grid-cols-3">
                      <Link to={"sales-by-item"} className="text-blue-600">
                        Sales by Item
                      </Link>
                      <p>Sales by Item</p>
                      <p>System Generated</p>
                    </div>
                    <div className=" py-2 grid grid-cols-3">
                      <p className="text-blue-600">Sales Return History</p>
                      <p>Sales Return History</p>
                      <p>System Generated</p>
                    </div>
                  </div>
                </div>

                <div id="inventory" className="sticky top-0 bg-white">
                  <div className="bg-gray-200 p-2 uppercase text-base font-medium text-gray-600  border border-y-gray-300">
                    <div className="inline-flex gap-2">
                      <p className="text-neutral-800">Inventory</p>
                      <span className="aspect-square p-1 px-2 leading-4 text-[12px] rounded-sm bg-neutral-400">
                        4
                      </span>
                    </div>
                  </div>
                  <div className=" px-2 text-sm font-medium text-neutral-800 border-x">
                    <div className=" py-2 grid grid-cols-3">
                      <p className="text-blue-600">Inventory Summary</p>
                      <p>Inventory Summary</p>
                      <p>System Generated</p>
                    </div>
                    <div className=" py-2 grid grid-cols-3">
                      <p className="text-blue-600">Inventory Aging Summary</p>
                      <p>Inventory Aging Summary</p>
                      <p>System Generated</p>
                    </div>
                    <div className=" py-2 grid grid-cols-3">
                      <p className="text-blue-600">Stock Summary Report</p>
                      <p>Stock Summary Report</p>
                      <p>System Generated</p>
                    </div>
                  </div>
                </div>

                <div className="sticky top-0 bg-white">
                  <div className="bg-gray-200 p-2 uppercase text-base font-medium text-gray-600  border border-y-gray-300">
                    <div className="inline-flex gap-2">
                      <p className="text-neutral-800">Receivable</p>
                      <span className="aspect-square p-1 px-2 leading-4 text-[12px] rounded-sm bg-neutral-400">
                        4
                      </span>
                    </div>
                  </div>
                  <div className=" px-2 text-sm font-medium text-neutral-800 border-x">
                    <div className=" py-2 grid grid-cols-3">
                      <p className="text-blue-600">Sales by Customer</p>
                      <p>Sales by Customer</p>
                      <p>System Generated</p>
                    </div>
                    <div className=" py-2 grid grid-cols-3">
                      <p className="text-blue-600">Sales by Item</p>
                      <p>Sales by Item</p>
                      <p>System Generated</p>
                    </div>
                    <div className=" py-2 grid grid-cols-3">
                      <p className="text-blue-600">Sales Return History</p>
                      <p>Sales Return History</p>
                      <p>System Generated</p>
                    </div>
                  </div>
                </div>

                <div className="sticky top-0 bg-white">
                  <div className="bg-gray-200 p-2 uppercase text-base font-medium text-gray-600  border border-y-gray-300">
                    <div className="inline-flex gap-2">
                      <p className="text-neutral-800">Payable</p>
                      <span className="aspect-square p-1 px-2 leading-4 text-[12px] rounded-sm bg-neutral-400">
                        4
                      </span>
                    </div>
                  </div>
                  <div className=" px-2 text-sm font-medium text-neutral-800 border-x">
                    <div className=" py-2 grid grid-cols-3">
                      <p className="text-blue-600">Inventory Summary</p>
                      <p>Inventory Summary</p>
                      <p>System Generated</p>
                    </div>
                    <div className=" py-2 grid grid-cols-3">
                      <p className="text-blue-600">Inventory Aging Summary</p>
                      <p>Inventory Aging Summary</p>
                      <p>System Generated</p>
                    </div>
                    <div className=" py-2 grid grid-cols-3">
                      <p className="text-blue-600">Stock Summary Report</p>
                      <p>Stock Summary Report</p>
                      <p>System Generated</p>
                    </div>
                  </div>
                </div>

                <div className="sticky top-0 bg-white">
                  <div className="bg-gray-200 p-2 uppercase text-base font-medium text-gray-600  border border-y-gray-300">
                    <div className="inline-flex gap-2">
                      <p className="text-neutral-800">Sales</p>
                      <span className="aspect-square p-1 px-2 leading-4 text-[12px] rounded-sm bg-neutral-400">
                        4
                      </span>
                    </div>
                  </div>
                  <div className=" px-2 text-sm font-medium text-neutral-800 border-x">
                    <div className=" py-2 grid grid-cols-3">
                      <p className="text-blue-600">Sales by Customer</p>
                      <p>Sales by Customer</p>
                      <p>System Generated</p>
                    </div>
                    <div className=" py-2 grid grid-cols-3">
                      <p className="text-blue-600">Sales by Item</p>
                      <p>Sales by Item</p>
                      <p>System Generated</p>
                    </div>
                    <div className=" py-2 grid grid-cols-3">
                      <p className="text-blue-600">Sales Return History</p>
                      <p>Sales Return History</p>
                      <p>System Generated</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-gray-200 p-2 uppercase text-base font-medium text-gray-600  border border-y-gray-300">
                    <div className="inline-flex gap-2">
                      <p className="text-neutral-800">Inventory</p>
                      <span className="aspect-square p-1 px-2 leading-4 text-[12px] rounded-sm bg-neutral-400">
                        4
                      </span>
                    </div>
                  </div>
                  <div className=" px-2 text-sm font-medium text-neutral-800 border-x">
                    <div className=" py-2 grid grid-cols-3">
                      <p className="text-blue-600">Inventory Summary</p>
                      <p>Inventory Summary</p>
                      <p>System Generated</p>
                    </div>
                    <div className=" py-2 grid grid-cols-3">
                      <p className="text-blue-600">Inventory Aging Summary</p>
                      <p>Inventory Aging Summary</p>
                      <p>System Generated</p>
                    </div>
                    <div className=" py-2 grid grid-cols-3">
                      <p className="text-blue-600">Stock Summary Report</p>
                      <p>Stock Summary Report</p>
                      <p>System Generated</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Report;
