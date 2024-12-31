import AddFormContainer from "@/components/AddFormContainer";
import SupplierFormWithTabs from "@/pages/test/__supplierForm";

const AddSuppliers = () => {
  return (
    <AddFormContainer title="New Supplier" backUrl="/admin/suppliers">
      <SupplierFormWithTabs />
    </AddFormContainer>
  );
};

export default AddSuppliers;
