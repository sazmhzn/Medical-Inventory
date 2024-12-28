import HeaderTitle from "@/components/commons/header-title";
import { Button } from "@/components/ui/button";
import { Info, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Suppliers = () => {
  return (
    <div className="w-full">
      <HeaderTitle />

      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="border-b py-4">
          <header className="flex justify-between px-6">
            <h1 className="text-2xl font-medium">All Suppliers</h1>
            <div className="inline-flex gap-4 items-center">
              <Button asChild>
                <Link
                  to="/suppliers/add-suppliers"
                  className="flex items-center gap-1"
                >
                  <PlusIcon /> New
                </Link>
              </Button>
            </div>
          </header>
        </section>
        <section className="p-6 ">
          <div className="flex flex-col gap-6 items-center justify-center  min-h-[50vh]">
            <div className="text-center">
              <h2 className="text-3xl font font-medium">
                Business is no fun without people.
              </h2>
              <p className="text-neutral-400">
                Create and manage your contacts, all in one place.
              </p>
            </div>

            <Button className="uppercase" asChild>
              <Link to={"/admin/suppliers/add-suppliers"}>
                Create New Vendor
              </Link>
            </Button>

            <Link to="/admin/suppliers/add-supplier">
              Click here to import vendors from file
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Suppliers;
