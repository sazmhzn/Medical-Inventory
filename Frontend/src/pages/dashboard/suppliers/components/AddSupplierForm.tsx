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

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

const orderFormSchema = z.object({
  companyName: z.string().min(1, {
    message: "Company name must be at least 1 character.",
  }),
  displayName: z.string().min(1, {
    message: "Display name must be at least 1 character.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.object({
    work: z.string(),
    personal: z.string().optional(),
  }),
});

const AddSupplierForm = () => {
  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      companyName: "",
      displayName: "",
    },
  });

  function onSubmit(values: z.infer<typeof orderFormSchema>) {
    console.log(values);
    console.log("Submitted");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 min-h-[80vh]"
      >
        <div className="md:w-1/2 gap-4 p-4">
          <div className="space-y-3 max-w-lg">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="flex gap-10 w-full  items-center">
                  <FormLabel className="w-[25ch] inline-block">
                    Company Name
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
              name="displayName"
              render={({ field }) => (
                <FormItem className="flex gap-10 w-full  items-center">
                  <FormLabel className="w-[25ch] inline-block">
                    Display Name
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
              name="email"
              render={({ field }) => (
                <FormItem className="flex gap-10 w-full  items-center">
                  <FormLabel className="w-[25ch] inline-block">
                    Email Address
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

            <div className="w-full inline-flex items-end justify-center gap-4">
              <FormField
                control={form.control}
                name="phone.work"
                render={({ field }) => (
                  <FormItem className="flex gap-10 w-full items-center">
                    <FormLabel className="w-[35ch] inline-block">
                      Phone
                    </FormLabel>
                    <div className="w-full lg:flex flex-col">
                      <FormControl>
                        <Input
                          className="bg-white focus-within:bg-white active:bg-white"
                          {...field}
                          placeholder="work phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone.personal"
                render={({ field }) => (
                  <FormItem className="flex  gap-10 w-1/2 items-center">
                    <div className="w-full lg:flex flex-col">
                      <FormControl>
                        <Input
                          className="bg-white focus-within:bg-white active:bg-white"
                          {...field}
                          placeholder="Mobile"
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

        <div className="lg:w-3/4 gap-4">
          <div>
            <h3 className="text-lg bg-gray-200 p-4 text-neutral-800 font-semibold">
              Other
            </h3>
            <div className="md:w-1/2 gap-4 p-4">
              <div className="space-y-3 max-w-lg">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex gap-10 w-full  items-center">
                      <FormLabel className="w-[25ch] inline-block">
                        Documents
                      </FormLabel>
                      <div className="w-full  lg:flex flex-col">
                        <FormControl>
                          <Input
                            type="file"
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

        <div className="sticky bg-neutral-100 border-t border-neutral-200 bottom-0 p-4 space-x-2">
          <Button variant="secondary">Save as draft</Button>
          <Button type="submit">Save and Send</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddSupplierForm;
