import { useQuery } from "@tanstack/react-query";
import { TaskList } from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth.tsx";

export default function Tasks() {
  const { user } = useAuth();
  const canCreateTasks = user?.role === 'owner' || user?.role === 'caretaker' || user?.role === 'handyman';

  return (
    <div className="mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
          {canCreateTasks && (
            <Button className="inline-flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Create Task
            </Button>
          )}
        </div>
        
        {/* Tasks List */}
        <TaskList />
      </div>
    </div>
  );
}
