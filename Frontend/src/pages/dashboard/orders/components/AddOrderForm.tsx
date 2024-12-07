import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useFieldArray, useForm } from "react-hook-form";
import { CalendarIcon, DeleteIcon } from "lucide-react";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useFetch } from "@/hooks/useFetch";

// Define the type for inventory items
type InventoryItem = {
  id: number;
  name: string;
  value: string;
};

type CustomerItem = {
  id: number;
  name: string;
  value: string;
};

const orderFormSchema = z.object({
  companyName: z.string().min(1, {
    message: "Customer name must be at least 3 characters.",
  }),
  displayName: z.string().min(1, {
    message: "Customer name must be at least 3 characters.",
  }),
  salesOrder: z.coerce
    .number({ invalid_type_error: "Order Number must be number." })
    .int("OrderNumber must be an integer."),
  salesOrderDate: z.date({
    required_error: "Sales order date is required.",
  }),
});

const AddOrderForm = () => {
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openItem, setOpenItem] = useState(false);
  const [customerValue, setCustomerValue] = useState("");
  const [itemValue, setItemValue] = useState("");
  const [submittedValue, setSubmittedValue] = useState(null);

  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customer: "",
      salesOrder: 0,
      salesOrderDate: new Date(),
      items: [{ id: 0, name: "", qty: 1, rate: 0, tax: 0, amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  function onSubmit(values: z.infer<typeof orderFormSchema>) {
    console.log(values);
    console.log("Submitted");
  }

  const {
    data: inventoryData,
    loading: inventoryLoading,
    error: inventoryError,
  } = useFetch("inventory");

  // Fetch customer data
  const {
    data: customerData,
    loading: customerLoading,
    error: customerError,
  } = useFetch<CustomerItem[]>("customers");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 min-h-[80vh]"
      >
        <div className="grid lg:grid-cols-2 bg-neutral-50 gap-4 p-4">
          <div className="space-y-3 lg:max-w-xl ">
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem className="flex lg:gap-14 gap-20 items-center">
                  <FormLabel
                    htmlFor="customer"
                    className="lg:w-[20ch] w-[20ch] "
                  >
                    Customer
                  </FormLabel>
                  <div className="w-full">
                    <Popover open={openCustomer} onOpenChange={setOpenCustomer}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? customerData?.find(
                                  (customer: CustomerItem) =>
                                    customer.name === field.value
                                )?.name
                              : "Select a customer"}

                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="lg:w-[450px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search customer or add"
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No customer found.</CommandEmpty>
                            <CommandGroup>
                              {customerData?.map((customer: CustomerItem) => (
                                <CommandItem
                                  key={customer.id}
                                  value={customer.name}
                                  onSelect={(currentValue) => {
                                    form.setValue("customer", currentValue);
                                    setOpenCustomer(false);
                                  }}
                                >
                                  {customer.name}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      field.value === customer.name
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="md:w-1/2 gap-4 p-4">
          <div className="space-y-3 max-w-lg">
            <FormField
              control={form.control}
              name="salesOrder"
              render={({ field }) => (
                <FormItem className="flex gap-10 w-full  items-center">
                  <FormLabel className="w-[25ch] inline-block">
                    Sales Order#
                  </FormLabel>
                  <div className="w-full  lg:flex flex-col">
                    <FormControl>
                      <Input
                        className="bg-white focus-within:bg-white active:bg-white"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salesOrderDate"
              render={({ field }) => (
                <FormItem className="flex gap-10 items-center">
                  <FormLabel className="w-[25ch]">Sales Order Date</FormLabel>
                  <div className="w-full flex flex-col">
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipmentDate"
              render={({ field }) => (
                <FormItem className="flex gap-10 items-center">
                  <FormLabel className="w-[25ch]">
                    Expected Shipment Date
                  </FormLabel>
                  <div className="w-full flex flex-col">
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>MM DD YYYY</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Calendar
                            mode="single"
                            // selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="lg:w-3/4 gap-4">
          <div>
            <h3 className="text-lg bg-gray-200 p-4 text-neutral-800 font-semibold">
              Item Table
            </h3>
            <div className="p-4">
              <Table className="">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow className="">
                    <TableHead className="">Item</TableHead>
                    <TableHead className="">Quantity</TableHead>
                    <TableHead className="">Rate</TableHead>
                    <TableHead className="">Tax</TableHead>
                    <TableHead className="">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((item, index) => (
                    <TableRow key={item.id} className="p-4">
                      <TableCell className="font-medium border-r">
                        <FormField
                          control={form.control}
                          name={`items.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex gap-4 w-full  items-center">
                              <div className="w-full  lg:flex flex-col">
                                <FormControl>
                                  <Popover
                                    open={openItem}
                                    onOpenChange={setOpenItem}
                                  >
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          "w-full justify-between",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        {field.value
                                          ? inventoryData?.find(
                                              (inv: InventoryItem) =>
                                                inv.name === field.value
                                            )?.name
                                          : "Select an item"}

                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="lg:w-[450px] p-0">
                                      <Command>
                                        <CommandInput
                                          placeholder="Search inventory"
                                          className="h-9"
                                        />
                                        <CommandList>
                                          <CommandEmpty>
                                            No item found.
                                          </CommandEmpty>
                                          <CommandGroup>
                                            {inventoryData?.map(
                                              (inv: InventoryItem) => (
                                                <CommandItem
                                                  key={inv.id}
                                                  value={inv.name}
                                                  onSelect={() => {
                                                    form.setValue(
                                                      `items.${index}.name`,
                                                      inv.name
                                                    );
                                                    form.setValue(
                                                      `items.${index}.id`,
                                                      inv.id
                                                    );
                                                    setOpenItem(false);
                                                  }}
                                                >
                                                  {inv.name}
                                                  <CheckIcon
                                                    className={
                                                      (cn(
                                                        "ml-auto h-4 w-4",
                                                        itemValue === inv.value
                                                          ? "opacity-100"
                                                          : "opacity-0"
                                                      ),
                                                      form.watch(
                                                        `items.${index}.name`
                                                      ) === inv.name
                                                        ? "opacity-100"
                                                        : "opacity-0")
                                                    }
                                                  />
                                                </CommandItem>
                                              )
                                            )}
                                          </CommandGroup>
                                        </CommandList>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="border-r ">
                        <FormField
                          control={form.control}
                          name={`items.${index}.qty`}
                          render={({ field }) => (
                            <FormItem className="flex gap-4 w-full items-center">
                              <div className="w-full  lg:flex flex-col">
                                <FormControl>
                                  <Input
                                    className="bg-white border-none focus-within:bg-white active:bg-white"
                                    {...field}
                                    required
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="border-r ">
                        <FormField
                          control={form.control}
                          name={`items.${index}.rate`}
                          render={({ field }) => (
                            <FormItem className="flex gap-4 w-full  items-center">
                              <div className="w-full lg:flex flex-col">
                                <FormControl>
                                  <Input
                                    className="bg-white border-none focus-within:bg-white active:bg-white"
                                    {...field}
                                    required
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="border-r ">
                        <FormField
                          control={form.control}
                          name={`items.${index}.tax`}
                          render={({ field }) => (
                            <FormItem className="flex gap-4 w-full  items-center">
                              <div className="w-full  lg:flex flex-col">
                                <FormControl>
                                  <Input
                                    className="bg-white border-none focus-within:bg-white active:bg-white"
                                    {...field}
                                    required
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="font-bold border-r">
                        Amt. 0.00
                      </TableCell>
                      <TableCell className="font-bold border-r">
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => index > 0 && remove(index)} // Prevent removal if index is 0
                          disabled={index === 0}
                        >
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <Button
                      variant={"link"}
                      onClick={() =>
                        append({
                          itemDetails: "",
                          qty: 1,
                          rate: 0,
                          tax: 0,
                          amount: 0,
                        })
                      }
                    >
                      Add item
                    </Button>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        </div>

        <div className="sticky bg-neutral-100 border-t border-neutral-200 bottom-0 p-4 space-x-2">
          <Button variant="secondary">Save as draft</Button>
          <Button type="submit">Save and Send</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddOrderForm;
