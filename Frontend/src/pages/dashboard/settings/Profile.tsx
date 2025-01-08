import { getCustomFields } from "@/lib/customFileManager";
import { useFetchUserById } from "@/services/UserAPI";
import { useNavigate } from "react-router-dom";
import { BackHeader } from "../components/PageHeader";
import CustomTooltip from "@/components/ToolTipAlert";
import { CircleHelp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { itemFields } from "@/config/OrganizationField";
import DynamicFormGenerator from "@/pages/test/__testDynamicForm";

const Profile = () => {
  const navigate = useNavigate();
  const { data: itemDetails, loading, error } = useFetchUserById("1");

  const customFields = getCustomFields("custom");

  const handleSubmit = async (data: Record<string, any>) => {
    console.log("clicked");
    try {
      // const result = await updateInventoryItem(id, data);
      console.log(data);
      alert("Item added successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const additionalContent = (
    <div className="mt-4 p-4">
      <h3 className="text-2xl font-medium">
        Track Inventory for this item{" "}
        <CustomTooltip
          icon={<CircleHelp className="w-4 h-4" />}
          content="Enable this option to track this item's stock based on its sales and purchase transactions."
        />
      </h3>
      <p className="font-normal text-neutral-400">
        You cannot enable/disable inventory tracking once you've created
        transactions for this item
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-800">Error loading item details</p>
      </div>
    );
  }

  const fields = [...itemFields, ...customFields];
  return (
    <div className="w-full">
      <div className="bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="border-b pb-0">
          <BackHeader title="Organization Profile" backTo="/admin" />
        </section>

        <section>
          <DynamicFormGenerator
            fields={fields}
            context="admin"
            onSubmit={handleSubmit}
            title="Organization Profile"
            initialValues={itemDetails} // Pass the fetched data as initial values
          />
        </section>
      </div>
    </div>
  );
};

export default Profile;
