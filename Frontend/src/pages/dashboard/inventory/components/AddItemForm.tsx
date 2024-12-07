import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, CircleHelp } from "lucide-react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import CustomTooltip from "@/components/ToolTipAlert";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";

const units = [
  { value: "kg", label: "Kilogram" },
  { value: "g", label: "Gram" },
  { value: "lb", label: "Pound" },
  { value: "oz", label: "Ounce" },
  { value: "l", label: "Liter" },
  { value: "ml", label: "Milliliter" },
];

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  sku: z.string().optional(),
  unit: z.string().nonempty({
    message: "Unit is required.",
  }),
  type: z.enum(["good", "service"]),
  stock: z.coerce
    .number()
    .min(0, { message: "Stock must be a non-negative number." }),
  price: z.coerce
    .number()
    .min(0, {
      message: "Price must be a non-negative number.",
    })
    .optional(),
  reorder: z.coerce
    .number()
    .min(0, {
      message: "Reorder point must be a non-negative number.",
    })
    .optional(),
});

const AddItemForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      unit: "",
      type: "service",
      stock: 0,
      price: 0,
      reorder: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const [open, setOpen] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 bg-neutral-50 gap-4 p-4">
          <div className="space-y-3 flex-1 max-w-lg">
            <div className="flex">
              <p className="inline-flex items-center gap-2 w-[30%]">
                Type
                <CustomTooltip
                  icon={<CircleHelp className="w-4 h-4" />}
                  content="Select if this item is a physical
                  good or a service. Remember that you cannot change the type if this item is included in a transaction."
                />
              </p>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <RadioGroup {...field} className="flex gap-4 font-normal">
                    <div className=" space-x-2">
                      <RadioGroupItem value="good" id="good" />
                      <Label
                        htmlFor="good"
                        className="font-normal w-[35%] text-base"
                      >
                        Good
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="service" id="service" />
                      <Label htmlFor="service" className="font-medium">
                        Service
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex gap-4 justify-start items-center">
                  <FormLabel className="w-[35%] ">Name</FormLabel>
                  <div className="w-full flex flex-col">
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
              name="sku"
              render={({ field }) => (
                <FormItem className="flex gap-4 items-center">
                  <FormLabel className="w-[35%] ">SKU</FormLabel>
                  <div className="w-full">
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
            <div className="flex items-center gap-4">
              <Label htmlFor="unit" className="w-[35%] ">
                Unit
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between "
                  >
                    {form.watch("unit")
                      ? units.find((unit) => unit.value === form.watch("unit"))
                          ?.label
                      : "Select unit..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[320px]">
                  <Command className="w-full ">
                    <CommandInput placeholder="Search unit..." />
                    <CommandList>
                      <CommandEmpty>No unit found.</CommandEmpty>
                      <CommandGroup>
                        {units.map((unit) => (
                          <CommandItem
                            key={unit.value}
                            value={unit.value}
                            onSelect={(currentValue) => {
                              form.setValue("unit", currentValue);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.watch("unit") === unit.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {unit.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className=" flex items-center justify-start">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center text-center justify-center p-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 hover:border-blue-300 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <Input id="dropzone-file" type="file" className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <div className="mt-4 p-4">
            <h3 className="text-2xl font-medium">
              Track Inventory for this item{" "}
              <CustomTooltip
                icon={<CircleHelp className="w-4 h-4" />}
                content="Enable this option to track this item's stock based on its sales and purchase transactions."
              />{" "}
            </h3>
            <p className="font-normal text-neutral-400">
              You cannot enable/disable inventory tracking once you've created
              transactions for this item
            </p>
            <div className="grid grid-cols-2">
              <div className="space-y-3 max-w-lg">
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem className="flex gap-4 w-full  items-center">
                      <FormLabel className="w-[35%] inline-block">
                        Opening Stock
                      </FormLabel>
                      <div className="w-full  lg:flex flex-col">
                        <FormControl>
                          <Input
                            type="number"
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
                  name="reorder"
                  render={({ field }) => (
                    <FormItem className="flex gap-4 items-center">
                      <FormLabel className="w-[35%]">Reorder Point</FormLabel>
                      <div className="w-full flex flex-col">
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
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex w-full gap-4 items-center">
                      <FormLabel className="w-[35%]">Rate per unit</FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <Input
                            type="number"
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
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0">
          <Button type="submit">Add Item</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddItemForm;
