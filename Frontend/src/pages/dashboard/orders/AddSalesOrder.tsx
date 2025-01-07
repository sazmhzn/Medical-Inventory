import AddFormContainer from "@/components/AddFormContainer";
import { SupplierSelect } from "./components/SupplierSelect";
import { OrderItemsTable } from "./components/OrderItemsTable";
import { calculateTotal } from "@/utils/orderCalculations";
import { useCallback, useState } from "react";
import { OrderItem } from "types/types";
import DynamicFormGenerator, {
  FieldConfig,
} from "@/pages/test/__testDynamicForm";
import { useCreateOrder } from "@/services/OrderAPI";
import { useToast } from "@/hooks/use-toast";
import { orderFields } from "@/config/OrderFields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import HeaderTitle from "@/components/commons/header-title";
import { PageHeader } from "../components/PageHeader";
import { useFetchCustomFormsByEntityType } from "@/services/CustomFormAPI";
import { CustomField } from "types/customFields";

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
  const {
    data: customFormsData,
    loading,
    error,
  } = useFetchCustomFormsByEntityType("orders");

  const [selectedSupplier, setSelectedSupplier] = useState<number>(0);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([initialOrderItem]);

  const transformCustomFields = useCallback(
    (customForms: any): FieldConfig[] => {
      if (!customForms || !customForms[0]?.formConfig?.fields) return [];

      return customForms[0].formConfig.fields.map((field: CustomField) => ({
        name: field.name,
        label: field.label,
        type: field.dataType,
        required: field.isRequired,
        gridWidth: "full",
        section: "custom",
        options: field.options,
      }));
    },
    []
  );

  // Combine default fields with custom fields
  const allFields = useCallback(() => {
    const customFields = transformCustomFields(customFormsData);
    return [...orderFields, ...customFields];
  }, [customFormsData, transformCustomFields]);

  console.log([allFields]);

  const handleSubmit = async (formData: any) => {
    try {
      // Separate custom fields from regular fields
      const customFields = allFields().filter(
        (field) => field.section === "custom"
      );
      const customValues: Record<string, any> = {};

      customFields.forEach((field) => {
        if (formData[field.name] !== undefined) {
          customValues[field.name] = formData[field.name];
          delete formData[field.name]; // Remove from main data object
        }
      });

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
        customFormData: customFormsData?.[0]
          ? { id: customFormsData[0].id }
          : null,
        customValue:
          Object.keys(customValues).length > 0
            ? JSON.stringify(customValues)
            : null,
      };

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
    <div className="w-full">
      <HeaderTitle title="Order" />

      <div className="bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="border-b pb-0">
          <PageHeader title="New Order" backButtonLink="/admin/orders" />
        </section>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to add supplier"}
            </AlertDescription>
          </Alert>
        )}

        <section>
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
                <OrderItemsTable
                  items={orderItems}
                  onItemsChange={setOrderItems}
                />
              </>
            }
          />
        </section>
      </div>
    </div>
  );
};

export default AddSalesOrders;
