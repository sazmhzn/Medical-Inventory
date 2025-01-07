import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { useFetchAllUser } from "@/services/UserAPI";
import { useSuppliers } from "@/services/SupplierAPI";

interface SupplierSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const SupplierSelect = ({ value, onChange }: SupplierSelectProps) => {
  // const { data: users, loading } = useFetchAllUser("user");
  const { data: suppliers, isLoading: loading, refetch } = useSuppliers(); // Using React Query hook

  const [open, setOpen] = useState(false);

  // Filter suppliers from all users
  // const suppliers =
  //   users?.filter(
  //     (user) =>
  //       user.roles.includes("SUPPLIER") || user.roles.includes("ROLE_SUPPLIER")
  //   ) || [];

  const selectedSupplier = suppliers?.find((s) => s.id.toString() === value);

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
              {suppliers?.map((supplier) => (
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
