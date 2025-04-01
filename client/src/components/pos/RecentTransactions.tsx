import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@/lib/types";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface TransactionItemProps {
  transaction: {
    title: string;
    amount: string;
    method: string;
    icon: string;
  };
}

function TransactionItem({ transaction }: TransactionItemProps) {
  const getIcon = (icon: string) => {
    if (icon === "dollar") {
      return (
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      );
    }
  };

  return (
    <li className="py-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {getIcon(transaction.icon)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {transaction.title}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {transaction.amount} - {transaction.method}
          </p>
        </div>
        <div>
          <Button variant="outline" className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50">
            View
          </Button>
        </div>
      </div>
    </li>
  );
}

// Sample transactions
const sampleTransactions = [
  {
    id: 1,
    title: "Sarah Johnson - July Rent",
    amount: "$1,200.00",
    method: "Credit Card",
    icon: "dollar"
  },
  {
    id: 2,
    title: "Michael Brown - July Rent",
    amount: "$1,450.00",
    method: "Bank Transfer",
    icon: "dollar"
  },
  {
    id: 3,
    title: "David Miller - Maintenance Fee",
    amount: "$75.00",
    method: "Credit Card",
    icon: "hammer"
  }
];

export function RecentTransactions() {
  const { data: transactions, isLoading } = useQuery({ 
    queryKey: ['/api/transactions'],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium leading-6 text-gray-900">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="flow-root">
        <ul className="-my-5 divide-y divide-gray-200">
          {sampleTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Transactions
        </Button>
      </CardFooter>
    </Card>
  );
}
