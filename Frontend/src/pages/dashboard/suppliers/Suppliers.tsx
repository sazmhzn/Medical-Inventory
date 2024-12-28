import HeaderTitle from "@/components/commons/header-title";
import { Button } from "@/components/ui/button";
import {
  DownloadCloudIcon,
  Info,
  PlusIcon,
  RefreshCwIcon,
  SettingsIcon,
  UploadCloudIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";

const Suppliers = () => {
  const handleImport = () => {
    console.log("Import Suppliers clicked");
  };

  const handleExport = () => {
    console.log("Export Suppliers clicked");
  };

  const handlePreference = () => {
    console.log("Preferences clicked");
  };

  const handleRefresh = () => {
    console.log("Refresh List clicked");
  };

  return (
    <div className="w-full">
      <HeaderTitle title="Dashboard" />

      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="border-b py-4">
          <PageHeader
            title="All Suppliers"
            newButtonLink="/admin/suppliers/add-suppliers"
            actions={[
              {
                label: "Import Suppliers",
                icon: <UploadCloudIcon className="h-4 w-4" />,
                onClick: handleImport,
              },
              {
                label: "Export Suppliers",
                icon: <DownloadCloudIcon className="h-4 w-4" />,
                onClick: handleExport,
              },
              {
                label: "Preferences",
                icon: <SettingsIcon className="h-4 w-4" />,
                onClick: handlePreference,
              },
              {
                label: "Refresh List",
                icon: <RefreshCwIcon className="h-4 w-4" />,
                onClick: handleRefresh,
              },
            ]}
          />
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
