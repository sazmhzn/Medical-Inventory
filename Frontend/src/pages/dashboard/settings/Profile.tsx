import { getCustomFields } from "@/lib/customFileManager";
import { useNavigate } from "react-router-dom";
import { BackHeader } from "../components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import DynamicFormGenerator from "@/pages/test/__testDynamicForm";
import { userFields } from "@/config/UserFields";
import { useUpdateUser, useUser } from "@/services/__test_usersAPI";
import { updateUser } from "@/services/UserAPI";

const Profile = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const id = user ? JSON.parse(user).id : null;
  const { data, isLoading, error } = useUser(id);
  console.log(data);

  const customFields = getCustomFields("custom");

  const handleSubmit = async (data: Record<string, any>) => {
    console.log("clicked");
    try {
      const result = await updateUser(id, data);
      console.log(result);
      alert("Item added successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  if (isLoading) {
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

  const fields = [...userFields, ...customFields];
  return (
    <div className="w-full">
      <div className="bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="border-b pb-0">
          <BackHeader title="Organization Profile" backTo="/admin" />
        </section>

        <section>
          <DynamicFormGenerator
            fields={fields}
            context="user"
            onSubmit={handleSubmit}
            title="Organization Profile"
            initialValues={data} // Pass the fetched data as initial values
          />
        </section>
      </div>
    </div>
  );
};

export default Profile;
