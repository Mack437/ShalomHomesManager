import { ReactNode } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  footerText?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
}

export function StatCard({ title, value, icon, footerText, trend }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          {icon && <div className="mr-3 text-gray-400">{icon}</div>}
          <dt className="text-sm font-medium text-gray-500 truncate">
            {title}
          </dt>
        </div>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">
          {value}
        </dd>
      </CardContent>
      {(footerText || trend) && (
        <CardFooter className="bg-gray-50 px-4 py-3 sm:px-6 flex items-center justify-between">
          {footerText && <div className="text-sm text-gray-500">{footerText}</div>}
          {trend && (
            <div className={`flex items-center text-sm font-medium ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.positive ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              {trend.value}%
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
