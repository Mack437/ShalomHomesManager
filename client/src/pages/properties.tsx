import { useQuery } from "@tanstack/react-query";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth.tsx";

export default function Properties() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'owner' || user?.role === 'caretaker';

  return (
    <div className="mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Properties</h1>
          {isAdmin && (
            <Button className="inline-flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Add Property
            </Button>
          )}
        </div>
        
        {/* Property Grid */}
        <PropertyGrid />
      </div>
    </div>
  );
}
