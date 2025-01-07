import HeaderTitle from "@/components/commons/header-title";
import type { ReactNode } from "react";
import { PageHeader } from "@/pages/dashboard/components/PageHeader";

interface AddFormContainerProps {
  title: string;
  backUrl: string;
  children: ReactNode;
}

const 
AddFormContainer = ({ children }: AddFormContainerProps) => {
  return (
    <div className="w-full">
      <HeaderTitle />

      <div className="bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="border-b pb-4">
          <PageHeader title="New Suppliers" backButtonLink="/admin/suppliers" />
        </section>

        <section>{children}</section>
      </div>
    </div>
  );
};

export default AddFormContainer;
