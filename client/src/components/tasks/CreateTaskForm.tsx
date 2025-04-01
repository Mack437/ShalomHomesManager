import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { insertTaskSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// UI Components
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Extend the insert schema for form validation
const formSchema = insertTaskSchema.extend({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  dueDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type CreateTaskFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function CreateTaskForm({ onSuccess, onCancel }: CreateTaskFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [aiSuggestion, setAiSuggestion] = useState<{ priority: string; confidence: number; message: string } | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Get properties for the form
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['/api/properties'],
  });

  // Get users for the assignee field
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
  });

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "maintenance",
      priority: "medium",
      status: "open",
    },
  });

  // Watch description field for AI suggestions
  const description = form.watch("description");
  
  // Request AI suggestion when description changes (debounced)
  useEffect(() => {
    if (!description || description.length < 15) return;
    
    const timer = setTimeout(() => {
      suggestPriority(description);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [description]);

  // AI suggestion request
  const suggestPriority = async (description: string) => {
    if (isSuggesting) return;
    
    setIsSuggesting(true);
    try {
      const response = await fetch("/api/tasks/suggest-priority", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiSuggestion(data);
        
        // Auto-set the form value if confidence is high enough
        if (data.confidence > 0.7) {
          form.setValue("priority", data.priority);
        }
      }
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  // Create task mutation
  const createTask = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create task");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Task created successfully.",
      });
      
      // Invalidate tasks query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      
      // Reset form
      form.reset();
      setAiSuggestion(null);
      
      // Call success callback
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    },
  });

  // Form submission
  const onSubmit = (data: FormValues) => {
    createTask.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the task in detail..." 
                  className="h-24" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                {isSuggesting && (
                  <span className="flex items-center text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing with AI...
                  </span>
                )}
                {aiSuggestion && !isSuggesting && (
                  <div className="flex flex-col space-y-1 mt-1">
                    <Badge 
                      variant={aiSuggestion.priority === 'high' ? 'destructive' : 
                             aiSuggestion.priority === 'medium' ? 'default' : 'outline'}
                      className="w-fit"
                    >
                      {aiSuggestion.message}
                    </Badge>
                  </div>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="renovation">Renovation</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(Number(value))} 
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {propertiesLoading ? (
                      <SelectItem value="" disabled>Loading...</SelectItem>
                    ) : (
                      Array.isArray(properties) && properties.map((property: any) => (
                        <SelectItem key={property.id} value={property.id.toString()}>
                          {property.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedToId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign To</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(value ? Number(value) : null)} 
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {usersLoading ? (
                      <SelectItem value="" disabled>Loading...</SelectItem>
                    ) : (
                      Array.isArray(users) && users.map((user: any) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name} ({user.role})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={createTask.isPending}>
            {createTask.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Task
          </Button>
        </div>
      </form>
    </Form>
  );
}