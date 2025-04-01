import { PosForm } from "@/components/pos/PosForm";
import { RecentTransactions } from "@/components/pos/RecentTransactions";
import { useAuth } from "@/hooks/use-auth.tsx";
import { Redirect } from "wouter";

export default function POS() {
  const { user } = useAuth();
  const canAccessPOS = user?.role === 'owner' || user?.role === 'caretaker';
  
  // Redirect if user doesn't have permission
  if (!canAccessPOS) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">POS System</h1>
        <p className="mt-2 text-sm text-gray-500">Process payments and manage transactions</p>
        
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Transaction Form */}
          <div className="lg:col-span-2">
            <PosForm />
          </div>
          
          {/* Recent Transactions */}
          <div>
            <RecentTransactions />
          </div>
        </div>
      </div>
    </div>
  );
}
