import AddFormContainer from "@/components/AddFormContainer";
import { SupplierSelect } from "./components/SupplierSelect";
import { OrderItemsTable } from "./components/OrderItemsTable";
import { calculateTotal } from "@/utils/orderCalculations";
import { useState } from "react";
import { OrderItem } from "types/types";
import DynamicFormGenerator, {
  FieldConfig,
} from "@/pages/test/__testDynamicForm";
import { postOrder } from "@/services/OrderAPI";
import { toast, useToast } from "@/hooks/use-toast";
import { orderFields } from "@/config/OrderFields";

const AddSalesOrders = () => {
  const { toast } = useToast();
  const [selectedSupplier, setSelectedSupplier] = useState<number>(0);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: 1,
      inventoryId: 0,
      name: "",
      qty: 1,
      rate: 0,
      tax: 0,
      amount: 0,
    },
  ]);

  const handleSubmit = async (formData: any) => {
    const orderData = {
      supplierId: selectedSupplier,
      orderDate: formData.salesOrderDate,
      expectedDate: formData.shipmentDate,
      status: "PENDING",
      totalAmount: calculateTotal(orderItems),
      items: orderItems.map((item) => ({
        itemId: item.inventoryId,
        quantity: item.qty,
        price: item.rate,
      })),
    };
    try {
      toast({
        title: "Success!",
        description: `This is a success toast of`,
        variant: "success",
      });
      console.log("Order Items JSON:", JSON.stringify(orderData, null, 2));

      const result = await postOrder(orderData);
      console.log("Item added successfully:", orderData);
    } catch (err) {
      console.log(err);
    }

    // Handle submission logic here
    console.log(orderData);
  };

  const renderAdditionalContent = () => (
    <>
      <SupplierSelect
        value={selectedSupplier.toString()}
        onChange={(value) => setSelectedSupplier(Number(value))}
      />
      <OrderItemsTable items={orderItems} onItemsChange={setOrderItems} />
    </>
  );

  return (
    <AddFormContainer title="New Sales Order" backUrl="/orders">
      {/* <AddOrderForm /> */}
      <DynamicFormGenerator
        fields={orderFields}
        onSubmit={handleSubmit}
        title="Create Order"
        context="order"
        additionalContent={renderAdditionalContent()}
      />
    </AddFormContainer>
  );
};

export default AddSalesOrders;
