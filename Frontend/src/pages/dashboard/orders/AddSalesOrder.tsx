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

  const orderFields: FieldConfig[] = [
    {
      name: "companyName",
      label: "Company",
      type: "select",
      gridWidth: "full",
      options: [
        { value: "medicine", label: "Medicine" },
        { value: "equipment", label: "Equipment" },
        { value: "supplies", label: "Supplies" },
        { value: "supplement", label: "Supplement" },
      ],
      required: true,
    },
    {
      name: "salesOrder",
      label: "Sales Order #",
      type: "text",
      required: true,
      gridWidth: "half",
    },
    {
      name: "salesOrderDate",
      label: "Sales Order Date",
      type: "date",
      required: true,
      gridWidth: "half",
    },
    {
      name: "shipmentDate",
      label: "Expected Shipment Date",
      type: "date",
      required: true,
      gridWidth: "half",
    },
    {
      name: "paymentTerms",
      label: "Payment Terms",
      type: "select",
      required: true,
      gridWidth: "half",
      options: [
        { value: "net30", label: "Net 30" },
        { value: "net60", label: "Net 60" },
        { value: "immediate", label: "Immediate" },
      ],
    },
  ];

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
