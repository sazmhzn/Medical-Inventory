import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

interface ValueCardProps {
  title: string;
  value: number;
  previousValue?: number;
}

export const ValueCard = ({ title, value, previousValue }: ValueCardProps) => {
  const isIncreasing =
    previousValue !== undefined ? value > previousValue : null;

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <h4>{title}</h4>
          <span
            className={`ml-2 ${isIncreasing ? "text-green-500" : "text-red-500"}`}
          >
            {isIncreasing ? <TrendingUp /> : <TrendingDown />}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-3xl font-bold text-neutral-600 bg-red">
        {value}
      </CardContent>
    </Card>
  );
};
