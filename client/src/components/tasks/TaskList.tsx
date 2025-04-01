import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, Clock, Building, User } from "lucide-react";

// Sample tasks
const sampleTasks = [
  {
    id: 1,
    title: "Repair leaking faucet in bathroom",
    property: "Shalom Heights, Apt 302",
    dueDate: "July 15, 2023",
    assignedTo: "Robert Lee (Handyman)",
    status: "in_progress" as const,
    icon: "wrench"
  },
  {
    id: 2,
    title: "Quarterly property inspection",
    property: "Garden Villas, Apt 105",
    dueDate: "July 20, 2023",
    assignedTo: "Mark Wilson (Caretaker)",
    status: "open" as const,
    icon: "clipboard-check"
  },
  {
    id: 3,
    title: "Repaint living room walls",
    property: "Shalom Towers, Apt 501",
    dueDate: "July 10, 2023",
    assignedTo: "ABC Contractors",
    status: "completed" as const,
    icon: "paint-roller"
  }
];

export function TaskList() {
  const [filter, setFilter] = useState("all");
  const [taskType, setTaskType] = useState("all");

  const { data: tasks, isLoading } = useQuery({ 
    queryKey: ['/api/tasks'],
  });

  // Use sample data for now
  const filteredTasks = sampleTasks.filter(task => {
    if (filter !== "all" && task.status !== filter) {
      return false;
    }
    if (taskType !== "all") {
      // In a real app, we would filter by task type
      return true;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Open</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      default:
        return null;
    }
  };

  const getTaskIcon = (icon: string) => {
    switch (icon) {
      case "wrench":
        return (
          <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        );
      case "clipboard-check":
        return (
          <div className="h-12 w-12 rounded-full bg-green-500 text-white flex items-center justify-center">
            <CheckSquare className="h-6 w-6" />
          </div>
        );
      case "paint-roller":
        return (
          <div className="h-12 w-12 rounded-full bg-amber-500 text-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-12 w-12 rounded-full bg-gray-500 text-white flex items-center justify-center">
            <CheckSquare className="h-6 w-6" />
          </div>
        );
    }
  };

  return (
    <div>
      {/* Task filters */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center">
        <div className="flex space-x-2">
          <Button 
            variant={filter === "all" ? "default" : "ghost"} 
            className={filter === "all" ? "" : "text-gray-700 hover:bg-gray-100"} 
            onClick={() => setFilter("all")}
          >
            All Tasks
          </Button>
          <Button 
            variant={filter === "open" ? "default" : "ghost"} 
            className={filter === "open" ? "" : "text-gray-700 hover:bg-gray-100"} 
            onClick={() => setFilter("open")}
          >
            Open
          </Button>
          <Button 
            variant={filter === "in_progress" ? "default" : "ghost"} 
            className={filter === "in_progress" ? "" : "text-gray-700 hover:bg-gray-100"} 
            onClick={() => setFilter("in_progress")}
          >
            In Progress
          </Button>
          <Button 
            variant={filter === "completed" ? "default" : "ghost"} 
            className={filter === "completed" ? "" : "text-gray-700 hover:bg-gray-100"} 
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Select defaultValue="all" onValueChange={setTaskType}>
            <SelectTrigger>
              <SelectValue placeholder="All Task Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Task Types</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="inspection">Inspection</SelectItem>
              <SelectItem value="administrative">Administrative</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Tasks list */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <div className="block hover:bg-gray-50">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="flex-shrink-0">
                      {getTaskIcon(task.icon)}
                    </div>
                    <div className="min-w-0 flex-1 px-4">
                      <div>
                        <p className="text-sm font-medium text-primary truncate">
                          {task.title}
                        </p>
                        <p className="mt-1 flex items-center text-sm text-gray-500">
                          <Building className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span className="truncate">{task.property}</span>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">Due:</span> {task.dueDate}
                        </p>
                        <p className="ml-6 text-sm text-gray-500">
                          <span className="font-medium text-gray-900">Assigned to:</span> {task.assignedTo}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(task.status)}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
