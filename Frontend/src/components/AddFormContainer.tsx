import HeaderTitle from "@/components/commons/header-title";
import { Button } from "@/components/ui/button";
import { Cross } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface AddFormContainerProps {
  title: string;
  backUrl: string;
  children: ReactNode;
}

const AddFormContainer = ({
  title,
  backUrl,
  children,
}: AddFormContainerProps) => {
  return (
    <div className="w-full">
      <HeaderTitle />

      <div className="bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="border-b pb-4">
          <header className="flex justify-between px-6">
            <h1 className="text-2xl font-medium">{title}</h1>
            <div className="inline-flex gap-4 items-center">
              <Button variant="link" size="icon">
                <Link to={backUrl}>
                  <Cross />
                </Link>
              </Button>
            </div>
          </header>
        </section>

        <section>{children}</section>
      </div>
    </div>
  );
};

export default AddFormContainer;
