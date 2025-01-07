import AddFormContainer from "@/components/AddFormContainer";
import { SupplierSelect } from "./components/SupplierSelect";
import { OrderItemsTable } from "./components/OrderItemsTable";
import { calculateTotal } from "@/utils/orderCalculations";
import { useState } from "react";
import { OrderItem } from "types/types";
import DynamicFormGenerator from "@/pages/test/__testDynamicForm";
import { useCreateOrder } from "@/services/OrderAPI";
import { useToast } from "@/hooks/use-toast";
import { orderFields } from "@/config/OrderFields";

interface OrderFormData {
  salesOrderDate: string;
  shipmentDate: string;
}

const initialOrderItem: OrderItem = {
  id: 1,
  inventoryId: 0,
  name: "",
  qty: 1,
  rate: 0,
  tax: 0,
  amount: 0,
};
const AddSalesOrders = () => {
  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const [selectedSupplier, setSelectedSupplier] = useState<number>(0);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([initialOrderItem]);

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
      await createOrder.mutateAsync(orderData);
      toast({
        title: "Success!",
        description: "Order created successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
      console.error("Error creating order:", error);
    }
  };

  return (
    <AddFormContainer title="New Sales Order" backUrl="/orders">
      {/* <AddOrderForm /> */}
      <DynamicFormGenerator
        fields={orderFields}
        onSubmit={handleSubmit}
        title="Create Order"
        context="order"
        additionalContent={
          <>
            <SupplierSelect
              value={selectedSupplier.toString()}
              onChange={(value) => setSelectedSupplier(Number(value))}
            />
            <OrderItemsTable items={orderItems} onItemsChange={setOrderItems} />
          </>
        }
      />
    </AddFormContainer>
  );
};

export default AddSalesOrders;
