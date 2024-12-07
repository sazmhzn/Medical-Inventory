import HeaderTitle from "@/components/commons/header-title";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Chart } from "./components/PieChart";
import { Button } from "@/components/ui/button";
import Starter from "./components/Starter";

interface StockData {
  totalStock: number;
  previousTotalStock: number;
  alertStock: number;
  previousAlertStock: number;
  lowStock: number;
  previousLowStock: number;
  inStock: number;
  previousInStock: number;
}

const fetchStockData = (): Promise<StockData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalStock: 10,
        previousTotalStock: 200,
        alertStock: 5,
        previousAlertStock: 8,
        lowStock: 3,
        previousLowStock: 4,
        inStock: 7,
        previousInStock: 6,
      });
    }, 1000); // Simulate a 1-second delay
  });
};

const Dashboard = () => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  useEffect(() => {
    fetchStockData().then((data) => setStockData(data));
  }, []);

  if (!stockData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <HeaderTitle title="Dashbaord" />
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="starter">Getting Started</TabsTrigger>
            <TabsTrigger value="updates">Recent Updates</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <section className="my-6">
              <div className="flex items-start md:flex-row flex-col justify-between gap-6">
                <article className="border rounded-lg overflow-hidden md:w-2/3 w-full">
                  {/* <DataTable data={getTasks} columns={columns} /> */}
                  {/* <DataTable /> */}
                  <header className="bg-gray-100 p-4">
                    <h3 className="text-xl text-neutral-800">Sales Activity</h3>
                  </header>
                  <div className="flex justify-between items-center">
                    <div className="p-4 flex flex-col items-center">
                      <div className=" text-center mb-4">
                        <h1 className="text-5xl font-semibold text-blue-500">
                          0
                        </h1>
                        <p className="text-sm text-gray-400">Qty</p>
                      </div>
                      <div className="text-center inline-flex items-center gap-2">
                        <span className="aspect-square w-6 h-6 border rounded-full">
                          s
                        </span>
                        <p className="uppercase font-medium text-md">
                          {" "}
                          To be packed
                        </p>
                      </div>
                    </div>
                    <Separator orientation="vertical" className="h-20 border" />
                    <div className="p-4 flex flex-col items-center">
                      <div className=" text-center mb-4">
                        <h1 className="text-5xl font-semibold text-blue-500">
                          0
                        </h1>
                        <p className="text-sm text-gray-400">Qty</p>
                      </div>
                      <div className="text-center inline-flex items-center gap-2">
                        <span className="aspect-square w-6 h-6 border rounded-full">
                          s
                        </span>
                        <p className="uppercase font-medium text-md">
                          {" "}
                          To be Delivered
                        </p>
                      </div>
                    </div>
                    <Separator orientation="vertical" className="h-20 border" />
                    <div className="p-4 flex flex-col items-center">
                      <div className=" text-center mb-4">
                        <h1 className="text-5xl font-semibold text-blue-500">
                          0
                        </h1>
                        <p className="text-sm text-gray-400">Qty</p>
                      </div>
                      <div className="text-center inline-flex items-center gap-2">
                        <span className="aspect-square w-6 h-6 border rounded-full">
                          s
                        </span>
                        <p className="uppercase font-medium text-md">
                          {" "}
                          To be packed
                        </p>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="border rounded-lg overflow-hidden w-full md:w-1/3">
                  <header className="bg-gray-100 p-4">
                    <h3 className="text-xl text-neutral-800">
                      Inventory Summary
                    </h3>
                  </header>
                  <div className="p-4 flex flex-col justify-between ">
                    <div className="flex justify-between mb-4">
                      <h1 className="text-md font-normal text-neutral-400 uppercase">
                        Quantity in hand
                      </h1>
                      <p className="text-xl font-semibold text-neutral-800">
                        0
                      </p>
                    </div>
                    <Separator orientation="horizontal" className="mb-4" />
                    <div className="flex justify-between mb-4">
                      <h1 className="text-md font-normal text-neutral-400 uppercase">
                        Quantity to be received
                      </h1>
                      <p className="text-xl font-semibold text-neutral-800">
                        0
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            <section>
              <div className="flex gap-4">
                <article className="border rounded-lg overflow-hidden w-1/2">
                  {/* <DataTable data={getTasks} columns={columns} /> */}
                  {/* <DataTable /> */}
                  <header className="bg-gray-100 p-4">
                    <h3 className="text-xl text-neutral-800">
                      Product Details
                    </h3>
                  </header>
                  <div className="flex justify-between items-center">
                    <div className="p-4 w-full flex flex-col justify-between ">
                      <div className="flex justify-between mb-4">
                        <h1 className="text-md font-normal text-red-400 uppercase">
                          Low Stock Items
                        </h1>
                        <p className="text-xl font-semibold text-red-600">0</p>
                      </div>
                      <div className="flex justify-between mb-4">
                        <h1 className="text-md font-normal text-neutral-400 uppercase">
                          All Items Groups
                        </h1>
                        <p className="text-xl font-semibold text-neutral-800">
                          0
                        </p>
                      </div>
                      <div className="flex justify-between mb-4">
                        <h1 className="text-md font-normal text-neutral-400 uppercase">
                          All Items
                        </h1>
                        <p className="text-xl font-semibold text-neutral-800">
                          0
                        </p>
                      </div>
                    </div>
                    <Separator orientation="vertical" className="h-20 border" />
                    <div className="p-4 w-1/2 flex flex-col items-center">
                      <Chart />
                    </div>
                  </div>
                </article>

                <article className="border rounded-lg overflow-hidden w-1/2">
                  <header className="bg-gray-100 p-4 inline-flex w-full justify-between">
                    <h3 className="text-xl text-neutral-800">
                      Top Selling Products
                    </h3>

                    <Button variant="link">This month</Button>
                  </header>
                  <div className="p-4 flex flex-col justify-between ">
                    <div className="flex justify-between mb-4">
                      <h1 className="text-md font-normal text-neutral-400 uppercase">
                        Quantity in hand
                      </h1>
                      <p className="text-xl font-semibold text-neutral-800">
                        0
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          </TabsContent>
          <TabsContent value="starter">
            <Starter />
          </TabsContent>
          <TabsContent value="updates">Never Miss an Update</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
