import { useState, useEffect } from "react";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CaretSortIcon } from "@radix-ui/react-icons";
import DynamicFormGenerator, {
  FieldConfig,
} from "@/pages/test/__testDynamicForm";
import { useFetchInventory } from "@/services/InventoryAPI";
import { useFetchSuppliers } from "@/services/UserAPI";

export interface Inventory {
  id: number;
  name: string;
  description: string;
  sku: string;
  unit: string;
  type: "GOODS" | "SERVICE";
  stock: number;
  price: number;
  reorder: number;
  expiryDate?: string;
  manufacturer: string;
  batchNumber: string;
  category: string;
  storageConditions?: string;
  image?: string;
  createdDate: string;
  lastUpdatedDate: string;
}
// Add this to your API service file

interface OrderItem {
  id: number;
  inventoryId: number;
  name: string;
  sku: string;
  qty: number;
  rate: number;
  tax: number;
  amount: number;
}

// Supplier Select Component
const SupplierSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const { data: suppliers, loading } = useFetchSuppliers();
  const [open, setOpen] = useState(false);

  const selectedSupplier = suppliers.find((s) => s.id.toString() === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {selectedSupplier ? selectedSupplier.name : "Select a supplier"}
          <CaretSortIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search suppliers..." />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading..." : "No suppliers found."}
            </CommandEmpty>
            <CommandGroup>
              {suppliers.map((supplier) => (
                <CommandItem
                  key={supplier.id}
                  value={supplier.name}
                  onSelect={() => {
                    onChange(supplier.id.toString());
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span>{supplier.name}</span>
                    <span className="text-sm text-gray-500">
                      Contact: {supplier.contact} | Address: {supplier.address}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

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

const OrderForm = () => {
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: 1,
      inventoryId: 0,
      name: "",
      sku: "",
      qty: 1,
      rate: 0,
      tax: 0,
      amount: 0,
    },
  ]);
  const [openItems, setOpenItems] = useState<{ [key: number]: boolean }>({});
  const {
    data: inventoryData,
    loading,
    error,
  } = useFetchInventory("inventory");

  const { data: suppliers, loading: loadingSupplier } = useFetchSuppliers();
  const [open, setOpen] = useState(false);
  const selectedSupplier = suppliers.find((s) => s.id.toString() === value);

  const inventory = (inventoryData as Inventory[]) || [];

  const calculateItemAmount = (qty: number, rate: number, tax: number) => {
    const subtotal = qty * rate;
    const taxAmount = (subtotal * tax) / 100;
    return subtotal + taxAmount;
  };

  const calculateTotal = () => {
    return items.reduce(
      (total, item) =>
        total + calculateItemAmount(item.qty, item.rate, item.tax),
      0
    );
  };

  const toggleItemDropdown = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: any
  ) => {
    const newItems = [...items];

    if (field === "inventoryId") {
      const selectedItem = inventory.find((inv) => inv.id === value);
      if (selectedItem) {
        newItems[index] = {
          ...newItems[index],
          inventoryId: selectedItem.id,
          name: selectedItem.name,
          sku: selectedItem.sku,
          rate: selectedItem.price,
          amount: calculateItemAmount(
            newItems[index].qty,
            selectedItem.price,
            newItems[index].tax
          ),
        };
      }
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value,
        amount: calculateItemAmount(
          field === "qty" ? value : items[index].qty,
          field === "rate" ? value : items[index].rate,
          field === "tax" ? value : items[index].tax
        ),
      };
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        inventoryId: 0,
        name: "",
        sku: "",
        qty: 1,
        rate: 0,
        tax: 0,
        amount: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (formData: any) => {
    const completeOrderData = {
      ...formData,
      items: items,
      totalAmount: calculateTotal(),
    };
    console.log("Complete Order Data:", completeOrderData);
  };

  return (
    <div className="space-y-6">
      <DynamicFormGenerator
        fields={orderFields}
        onSubmit={handleSubmit}
        title="Create Order"
        context="order"
        additionalContent={
          <div className="mt-8">
            <h3 className="text-lg bg-gray-200 p-4 text-neutral-800 font-semibold">
              Order Items
            </h3>
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Tax (%)</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Popover
                          open={openItems[index]}
                          onOpenChange={() => toggleItemDropdown(index)}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                            >
                              {item.name || "Select an item"}
                              <CaretSortIcon className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0">
                            <Command>
                              <CommandInput placeholder="Search item..." />
                              <CommandList>
                                <CommandEmpty>
                                  {loading ? "Loading..." : "No items found."}
                                </CommandEmpty>
                                <CommandGroup>
                                  {inventory.map((inv) => (
                                    <CommandItem
                                      key={inv.id}
                                      value={inv.name}
                                      onSelect={() => {
                                        handleItemChange(
                                          index,
                                          "inventoryId",
                                          inv.id
                                        );
                                        toggleItemDropdown(index);
                                      }}
                                    >
                                      <div className="flex flex-col">
                                        <span>{inv.name}</span>
                                        <span className="text-sm text-gray-500">
                                          SKU: {inv.sku} | Stock: {inv.stock}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.qty}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "qty",
                              Number(e.target.value)
                            )
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "rate",
                              Number(e.target.value)
                            )
                          }
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.tax}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "tax",
                              Number(e.target.value)
                            )
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        ${item.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Button type="button" variant="outline" onClick={addItem}>
                        Add Item
                      </Button>
                    </TableCell>
                    <TableCell className="font-bold">
                      Total: ${calculateTotal().toFixed(2)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default OrderForm;
