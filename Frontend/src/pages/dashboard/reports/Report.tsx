import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import ReportSidebar from "./components/ReportSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Button } from "@/components/ui/button";
import { EllipsisVertical, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import LayoutConfigurationDialog from "./components/LayoutConfigurationDialog";

// Types
interface SelectedFields {
  orgName: boolean;
  pageNo: boolean;
  generatedDate: boolean;
  generatedBy: boolean;
  time: boolean;
}

const REPORT_CATEGORIES = [
  {
    name: "Sales",
    count: 4,
    reports: [
      {
        title: "Sales by Customer",
        type: "Sales by Customer",
        generated: "System Generated",
      },
      {
        title: "Sales by Item",
        type: "Sales by Item",
        generated: "System Generated",
      },
      {
        title: "Sales Return History",
        type: "Sales Return History",
        generated: "System Generated",
      },
    ],
  },
  {
    name: "Inventory",
    count: 4,
    reports: [
      {
        title: "Inventory Summary",
        type: "Inventory Summary",
        generated: "System Generated",
      },
      {
        title: "Inventory Aging Summary",
        type: "Inventory Aging Summary",
        generated: "System Generated",
      },
      {
        title: "Stock Summary Report",
        type: "Stock Summary Report",
        generated: "System Generated",
      },
    ],
  },
  // Other categories can be added similarly
];

const Report = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState<SelectedFields>({
    orgName: true,
    pageNo: false,
    generatedDate: true,
    generatedBy: true,
    time: true,
  });
  const [tableDesign, setTableDesign] = useState("default");
  const [orientation, setOrientation] = useState("Portrait");

  const handleSave = (config) => {
    // Handle saved configuration
    console.log(config);
  };

  const handleFieldChange = (field: keyof SelectedFields) => {
    setSelectedFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const renderReportCategory = (category: (typeof REPORT_CATEGORIES)[0]) => (
    <div key={category.name} className="sticky top-0 bg-white">
      <div className="bg-gray-200 p-2 uppercase text-base font-medium text-gray-600 border border-y-gray-300">
        <div className="inline-flex gap-2">
          <p className="text-neutral-800">{category.name}</p>
          <span className="aspect-square p-1 px-2 leading-4 text-[12px] rounded-sm bg-neutral-400">
            {category.count}
          </span>
        </div>
      </div>
      <div className="px-2 text-sm font-medium text-neutral-800 border-x">
        {category.reports.map((report, index) => (
          <div key={index} className="py-2 grid grid-cols-3">
            <Link
              to={report.type.toLowerCase().replace(/\s+/g, "-")}
              className="text-blue-600"
            >
              {report.title}
            </Link>
            <p>{report.type}</p>
            <p>{report.generated}</p>
          </div>
        ))}
      </div>
    </div>
  );

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
                      <Button variant="outline" size="icon" asChild>
                        <Link to={"/"}>
                          <EllipsisVertical className="w-4" />
                        </Link>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-2  shadow-none">
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant={"link"}
                            className="flex gap-2 bg-white shadow-none text-neutral-600"
                          >
                            {" "}
                            <span>
                              <LayoutGrid className="w-4" />
                            </span>{" "}
                            Layout Configuration
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">
                              Edit Layout Configuration
                            </DialogTitle>

                            <DialogDescription>
                              Make changes to your profile here. Click save when
                              you're done.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="flex gap-8 mt-6">
                            {/* Checkbox Section */}
                            <div className="w-1/2">
                              <h2 className="text-lg font-medium mb-4">
                                Choose Details to Display
                              </h2>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="Organization Name"
                                    checked={selectedFields.orgName}
                                    onChange={() =>
                                      handleFieldChange("orgName")
                                    }
                                  />
                                  <label
                                    htmlFor="Organization Name"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    Organization Name
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="Page Number"
                                    checked={selectedFields.pageNo}
                                    onChange={() => handleFieldChange("pageNo")}
                                  />
                                  <label
                                    htmlFor="Page Number"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    Page Number
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="Generated Date"
                                    checked={selectedFields.generatedDate}
                                    onChange={() =>
                                      handleFieldChange("generatedDate")
                                    }
                                  />
                                  <label
                                    htmlFor="Generated Date"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    Generated Date
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="w-1/2 border rounded-md p-6 bg-gray-100">
                              <header className="border-b pb-4 mb-4">
                                <h1 className="text-xl font-bold text-gray-800">
                                  Report Preview
                                </h1>
                              </header>
                              <main className="text-base text-gray-700">
                                {selectedFields.orgName && (
                                  <p className="mb-2">
                                    <strong>Organization Name:</strong> Example
                                    Org
                                  </p>
                                )}
                                {selectedFields.pageNo && (
                                  <p className="mb-2">
                                    <strong>Page Number:</strong> 1
                                  </p>
                                )}
                                {selectedFields.generatedDate && (
                                  <p className="mb-2">
                                    <strong>Generated Date:</strong> 2024-12-12
                                  </p>
                                )}
                                {selectedFields.generatedBy && (
                                  <p className="mb-2">
                                    <strong>Generated By:</strong> Admin
                                  </p>
                                )}
                                {selectedFields.time && (
                                  <p className="mb-2">
                                    <strong>Time:</strong> 12:00 PM
                                  </p>
                                )}
                              </main>
                              <footer className="border-t pt-4 mt-4 text-sm text-gray-600">
                                <p>
                                  Note: This is a dynamically generated preview
                                  based on the selected fields.
                                </p>
                              </footer>
                            </div>
                          </div>
                          {/* Report Layout Section */}
                          <div className="mt-6">
                            <h2 className="text-lg font-medium mb-4">
                              Report Layout
                            </h2>
                            <div className="flex flex-col gap-4">
                              {/* Table Design Select */}
                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  Table Design
                                </label>
                                <Select
                                  onValueChange={(e) => setTableDesign(e)}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={tableDesign} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {/* <SelectLabel>{tableDesign}</SelectLabel> */}
                                      <SelectItem value="default">
                                        Default
                                      </SelectItem>
                                      <SelectItem value="Alternative rows">
                                        Alternative Rows
                                      </SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Orientation Radio Buttons */}
                              <RadioGroup
                                defaultValue={orientation}
                                onChange={setOrientation}
                              >
                                <label className="block text-sm font-medium mb-2">
                                  Orientation
                                </label>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="default" id="r1" />
                                  <Label htmlFor="r1">Portriate</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="comfortable" id="r2" />
                                  <Label htmlFor="r2">Landscape</Label>
                                </div>
                              </RadioGroup>
                              <div>
                                {/* <RadioGroup
                                  value={orientation}
                                  onChange={setOrientation}
                                  className="flex gap-4"
                                >
                                  <Radio value="Portrait" label="Portrait" />
                                  <Radio value="Landscape" label="Landscape" />
                                </RadioGroup> */}
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 flex justify-end gap-4">
                            <button
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                              onClick={() => setDialogOpen(false)}
                            >
                              Cancel
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                              Save
                            </button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        {/* <LayoutConfigurationDialog
                          dialogOpen={dialogOpen}
                          setDialogOpen={setDialogOpen}
                          onSave={handleSave}
                        /> */}
                      </Dialog>
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
                {REPORT_CATEGORIES.map(renderReportCategory)}
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Report;
