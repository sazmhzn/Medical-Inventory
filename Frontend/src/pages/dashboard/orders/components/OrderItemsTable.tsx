// components/OrderItemsTable.tsx
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useFetchInventory } from "@/services/InventoryAPI";

import { Button } from "@/components/ui/button";
import { calculateItemAmount, calculateTotal } from "@/utils/orderCalculations";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";

import { OrderItem } from "types/types";
import { Inventory } from "./AddOrderForm";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface OrderItemsTableProps {
  items: OrderItem[];
  onItemsChange: (items: OrderItem[]) => void;
}

export const OrderItemsTable = ({
  items,
  onItemsChange,
}: OrderItemsTableProps) => {
  const [openItems, setOpenItems] = useState<{ [key: number]: boolean }>({});
  const { data: inventoryData, loading } = useFetchInventory("inventory");
  const inventory = (inventoryData as Inventory[]) || [];

  const toggleItemDropdown = (index: number) => {
    setOpenItems((prev) => ({ ...prev, [index]: !prev[index] }));
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
          qty: 1, // Reset quantity to 1 on item selection
          amount: calculateItemAmount(
            1,
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
    onItemsChange(newItems);
  };

  const addItem = () => {
    onItemsChange([
      ...items,
      // {
      //   id: items.length + 1,
      //   inventoryId: 0,
      //   name: "",
      //   qty: 1,
      //   rate: 0,
      //   tax: 0,
      //   amount: 0,
      // },
    ]);
  };

  const removeItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  return (
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
                    <PopoverContent align="start" className="w-[300px] p-0">
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
                <TableCell>{item.sku || "N/A"}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      handleItemChange(index, "qty", Number(e.target.value))
                    }
                    className="w-20"
                    disabled={!item.inventoryId}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(index, "rate", Number(e.target.value))
                    }
                    className="w-24"
                    disabled={!item.inventoryId}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.tax}
                    onChange={(e) =>
                      handleItemChange(index, "tax", Number(e.target.value))
                    }
                    className="w-20"
                    disabled={!item.inventoryId}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {/* ${item.amount.toFixed(2)}
                   */}
                  AMoutn goers here
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
                Total: ${calculateTotal(items).toFixed(2)}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};
