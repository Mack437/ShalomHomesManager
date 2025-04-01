import { useState } from "react";
import { EnhancedLoginForm } from "@/components/auth/EnhancedLoginForm";
import { EnhancedTaskForm } from "@/components/tasks/EnhancedTaskForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FormDemoPage() {
  const [activeTab, setActiveTab] = useState("login");
  
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Form Validation Micro-Interactions</h1>
          <p className="text-muted-foreground text-lg">
            Interactive form components with real-time validation feedback
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Choose a Form Demo</CardTitle>
            <CardDescription>
              Test our enhanced form components with micro-interactions for validation feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login Form</TabsTrigger>
                <TabsTrigger value="task">Task Form</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <div className="border rounded-lg p-4 bg-background/50">
                  <h2 className="text-xl font-semibold mb-4">Enhanced Login Form</h2>
                  <p className="text-muted-foreground mb-6">
                    This form features real-time validation with visual feedback, animations, 
                    and a more interactive user experience. Try entering invalid data to see the 
                    error states, or valid data to see success indicators.
                  </p>
                  <EnhancedLoginForm />
                </div>
              </TabsContent>
              
              <TabsContent value="task">
                <div className="border rounded-lg p-4 bg-background/50">
                  <h2 className="text-xl font-semibold mb-4">Enhanced Task Creation Form</h2>
                  <p className="text-muted-foreground mb-6">
                    This form showcases advanced validation with AI-powered suggestions.
                    Enter a detailed maintenance request description to see the AI suggest a 
                    priority level based on the content. All fields include micro-interactions
                    to guide users through the form completion process.
                  </p>
                  <EnhancedTaskForm 
                    onSuccess={() => {
                      // Just for the demo, reset the form and show a message
                      alert("Task created! (This is just a demo)");
                    }} 
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-sm text-muted-foreground text-center">
          <p>
            These forms demonstrate modern UI principles with micro-interactions that enhance
            user experience through subtle animations and immediate feedback.
          </p>
        </div>
      </div>
    </div>
  );
}