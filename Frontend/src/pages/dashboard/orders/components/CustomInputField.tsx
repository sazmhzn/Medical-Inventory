import { FC } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CustomInputFieldProps {
  control: any;
  name: string;
  label: string;
  required?: boolean;
}

const CustomInputField: FC<CustomInputFieldProps> = ({
  control,
  name,
  label,
  required = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex gap-4 justify-start items-center">
          <FormLabel className={`w-[35%] ${required ? "text-red-500" : ""}`}>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <div className="w-full flex flex-col">
            <FormControl>
              <Input
                className="bg-white focus-within:bg-white active:bg-white"
                {...field}
                required={required}
              />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default CustomInputField;
