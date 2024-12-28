import HeaderTitle from "@/components/commons/header-title";
import { Button } from "@/components/ui/button";
import { Cross } from "lucide-react";
import AddItemForm from "./components/AddItemForm";
import { Link } from "react-router-dom";

const AddItem = () => {
  return (
    <div className="w-full">
      <HeaderTitle title="Item" />

      <div className="bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="border-b pb-4">
          <header className="flex justify-between px-6">
            <h1 className="text-2xl font-medium">New Items</h1>
            <div className="inline-flex gap-4 items-center">
              <Button variant="link" size="icon">
                <Link to="/inventory">
                  <Cross />
                </Link>
              </Button>
            </div>
          </header>
        </section>

        <section className="grid grid-cols-3 px-0"></section>

        <section>
          <AddItemForm />
        </section>
      </div>
    </div>
  );
};

export default AddItem;
