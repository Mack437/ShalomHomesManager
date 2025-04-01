import { useState, useEffect } from "react";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormValidation, validators } from "@/hooks/use-form-validation";
import { ValidatedInput } from "@/components/ui/form-feedback";
import { FormResult } from "@/components/ui/form-result";

// UI Components
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  type: z.string(),
  priority: z.string(),
  propertyId: z.number().optional(),
  assignedToId: z.number().optional(),
  dueDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type EnhancedTaskFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function EnhancedTaskForm({ onSuccess, onCancel }: EnhancedTaskFormProps) {
  const queryClient = useQueryClient();
  const [aiSuggestion, setAiSuggestion] = useState<{ priority: string; confidence: number; message: string } | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [formResult, setFormResult] = useState<{
    type: 'success' | 'error' | 'loading' | null;
    message: string | null;
  }>({
    type: null,
    message: null
  });
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  // Get properties for the form
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['/api/properties'],
  });

  // Get users for the assignee field
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
  });

  // Form validation
  const formValidation = useFormValidation({
    title: '',
    description: '',
    type: 'maintenance',
    priority: 'medium',
    propertyId: undefined,
    assignedToId: undefined,
    dueDate: undefined
  }, {
    title: [
      validators.required('Title is required'),
      validators.minLength(3, 'Title must be at least 3 characters')
    ],
    description: [
      validators.required('Description is required'),
      validators.minLength(10, 'Description must be at least 10 characters')
    ],
    type: [
      validators.required('Task type is required')
    ],
    priority: [
      validators.required('Priority is required')
    ]
  });

  // Watch description field for AI suggestions
  useEffect(() => {
    const description = formValidation.fields.description.value;
    if (!description || description.length < 15) return;
    
    const timer = setTimeout(() => {
      suggestPriority(description);
    }, 800); // Debounce time
    
    return () => clearTimeout(timer);
  }, [formValidation.fields.description.value]);

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
          formValidation.handleChange('priority', data.priority);
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
      setFormResult({
        type: 'loading',
        message: 'Creating task...'
      });
      
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
      setFormResult({
        type: 'success',
        message: 'Task created successfully.'
      });
      
      // Invalidate tasks query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      
      // Reset form
      formValidation.resetForm();
      setAiSuggestion(null);
      setDueDate(undefined);
      
      // Call success callback
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    },
    onError: (error: Error) => {
      setFormResult({
        type: 'error',
        message: error.message || "Failed to create task"
      });
    },
  });

  // Convert form values to API data
  const convertFormValuesToApiData = (values: any) => {
    // Create an object with API-ready data
    const apiData: Record<string, any> = {
      title: values.title,
      description: values.description,
      type: values.type,
      priority: values.priority,
    };
    
    // Convert string IDs to numbers where needed
    if (values.propertyId) {
      apiData.propertyId = Number(values.propertyId);
    }
    
    if (values.assignedToId) {
      apiData.assignedToId = Number(values.assignedToId);
    }
    
    // Add due date if provided
    if (dueDate) {
      apiData.dueDate = dueDate;
    }
    
    return apiData;
  };
  
  // Form submission
  const handleSubmit = (values: FormValues) => {
    // Convert form values to API-ready data
    const apiData = convertFormValuesToApiData(values);
    
    // Call the mutation
    createTask.mutate(apiData as FormValues);
  };

  return (
    <div className="space-y-6">
      {/* Form Result Message */}
      <AnimatePresence>
        {formResult.type && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <FormResult 
              type={formResult.type} 
              message={formResult.message || ''} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <form onSubmit={formValidation.handleSubmit(handleSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-sm font-medium">Title</Label>
          <div className="mt-1">
            <ValidatedInput
              id="title"
              placeholder="Task title"
              value={formValidation.fields.title.value}
              onChange={(e) => formValidation.handleChange('title', e.target.value)}
              onFocus={() => formValidation.handleFocus('title')}
              onBlur={() => formValidation.handleBlur('title')}
              isValid={formValidation.fields.title.touched && formValidation.fields.title.valid}
              isInvalid={formValidation.fields.title.touched && !formValidation.fields.title.valid}
              validationMessage={formValidation.fields.title.error || undefined}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
          <div className="mt-1">
            <textarea
              id="description"
              placeholder="Describe the task in detail..."
              className={cn(
                "min-h-24 w-full rounded-md border p-3 text-sm transition-all duration-200 ease-in-out",
                formValidation.fields.description.touched && formValidation.fields.description.valid 
                  ? "border-green-400 ring-1 ring-green-200" 
                  : formValidation.fields.description.touched && !formValidation.fields.description.valid
                  ? "border-destructive ring-1 ring-destructive/20"
                  : "border-input"
              )}
              value={formValidation.fields.description.value}
              onChange={(e) => formValidation.handleChange('description', e.target.value)}
              onFocus={() => formValidation.handleFocus('description')}
              onBlur={() => formValidation.handleBlur('description')}
              required
            />
            
            {/* AI Suggestion Feedback */}
            <div className="mt-1.5 min-h-6">
              {isSuggesting && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center text-muted-foreground text-xs"
                >
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Analyzing with AI...
                </motion.div>
              )}
              {aiSuggestion && !isSuggesting && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col space-y-1"
                >
                  <Badge 
                    variant={aiSuggestion.priority === 'high' ? 'destructive' : 
                          aiSuggestion.priority === 'medium' ? 'default' : 'outline'}
                    className="w-fit text-xs"
                  >
                    {aiSuggestion.message}
                  </Badge>
                </motion.div>
              )}
              {formValidation.fields.description.touched && !formValidation.fields.description.valid && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-xs mt-1"
                >
                  {formValidation.fields.description.error}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="type" className="text-sm font-medium">Task Type</Label>
            <div className="mt-1">
              <Select 
                defaultValue={formValidation.fields.type.value}
                onValueChange={(value) => formValidation.handleChange('type', value)}
              >
                <SelectTrigger id="type" className={
                  formValidation.fields.type.touched && !formValidation.fields.type.valid
                    ? "border-destructive" 
                    : ""
                }>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="renovation">Renovation</SelectItem>
                </SelectContent>
              </Select>
              {formValidation.fields.type.touched && !formValidation.fields.type.valid && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-xs mt-1"
                >
                  {formValidation.fields.type.error}
                </motion.div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
            <div className="mt-1">
              <Select 
                value={formValidation.fields.priority.value}
                onValueChange={(value) => formValidation.handleChange('priority', value)}
              >
                <SelectTrigger id="priority" className={
                  formValidation.fields.priority.touched && !formValidation.fields.priority.valid
                    ? "border-destructive" 
                    : ""
                }>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              {formValidation.fields.priority.touched && !formValidation.fields.priority.valid && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-xs mt-1"
                >
                  {formValidation.fields.priority.error}
                </motion.div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="propertyId" className="text-sm font-medium">Property</Label>
            <div className="mt-1">
              <Select 
                value={formValidation.fields.propertyId.value?.toString() || ""}
                onValueChange={(value) => {
                  const numVal = value ? Number(value) : undefined;
                  formValidation.handleChange('propertyId', numVal?.toString() || '');
                }}
              >
                <SelectTrigger id="propertyId">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
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
            </div>
          </div>

          <div>
            <Label htmlFor="assignedToId" className="text-sm font-medium">Assign To</Label>
            <div className="mt-1">
              <Select 
                value={formValidation.fields.assignedToId.value?.toString() || ""}
                onValueChange={(value) => {
                  const numVal = value ? Number(value) : undefined;
                  formValidation.handleChange('assignedToId', numVal?.toString() || '');
                }}
              >
                <SelectTrigger id="assignedToId">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
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
            </div>
          </div>

          <div>
            <Label htmlFor="dueDate" className="text-sm font-medium">Due Date (Optional)</Label>
            <div className="mt-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dueDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    {dueDate ? (
                      format(dueDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </Button>
          )}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              type="submit" 
              disabled={createTask.isPending}
              className="flex items-center"
            >
              {createTask.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {createTask.isPending ? "Creating..." : "Create Task"}
            </Button>
          </motion.div>
        </div>
      </form>
    </div>
  );
}