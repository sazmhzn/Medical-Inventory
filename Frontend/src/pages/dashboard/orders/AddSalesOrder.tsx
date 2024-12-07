import AddFormContainer from "@/components/AddFormContainer";
import AddOrderForm from "./components/AddOrderForm";

const AddSalesOrders = () => {
  return (
    <AddFormContainer title="New Sales Order" backUrl="/orders">
      <AddOrderForm />
    </AddFormContainer>
  );
};

export default AddSalesOrders;
