import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TaskList } from "@/components/tasks/TaskList";
import { CreateTaskForm } from "@/components/tasks/CreateTaskForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth.tsx";

// Dialog components for task creation
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Tasks() {
  const { user } = useAuth();
  const canCreateTasks = user?.role === 'owner' || user?.role === 'caretaker' || user?.role === 'handyman';
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTaskCreated = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
          {canCreateTasks && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="inline-flex items-center">
                  <Plus className="mr-2 h-4 w-4" /> Create Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Create a new task to manage maintenance, inspections, and other property-related activities.
                    Our AI will analyze your description and suggest an appropriate priority level.
                  </DialogDescription>
                </DialogHeader>
                <CreateTaskForm onSuccess={handleTaskCreated} />
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        {/* Tasks List */}
        <TaskList />
      </div>
    </div>
  );
}
