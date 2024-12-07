import AddFormContainer from "@/components/AddFormContainer";
import AddSupplierForm from "./components/AddSupplierForm";

const AddSuppliers = () => {
  return (
    <AddFormContainer title="New Supplier" backUrl="/suppliers">
      <AddSupplierForm />
    </AddFormContainer>
  );
};

export default AddSuppliers;