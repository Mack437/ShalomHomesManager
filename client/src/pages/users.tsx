import { UserTable } from "@/components/users/UserTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth.tsx";
import { Redirect } from "wouter";

export default function Users() {
  const { user } = useAuth();
  const canManageUsers = user?.role === 'owner' || user?.role === 'caretaker';
  
  // Redirect if user doesn't have permission
  if (!canManageUsers) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <Button className="inline-flex items-center">
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
        
        {/* Users Table */}
        <UserTable />
      </div>
    </div>
  );
}
