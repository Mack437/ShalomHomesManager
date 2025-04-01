import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth.tsx";
import { FaGoogle } from "react-icons/fa";

// Email login schema
const emailLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional()
});

// Username login schema
const usernameLoginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional()
});

type EmailLoginFormValues = z.infer<typeof emailLoginSchema>;
type UsernameLoginFormValues = z.infer<typeof usernameLoginSchema>;

export function LoginForm() {
  const { login, loginWithUsername, googleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("email");

  // Email form
  const emailForm = useForm<EmailLoginFormValues>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  // Username form
  const usernameForm = useForm<UsernameLoginFormValues>({
    resolver: zodResolver(usernameLoginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false
    }
  });

  const onEmailSubmit = async (data: EmailLoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  const onUsernameSubmit = async (data: UsernameLoginFormValues) => {
    setIsLoading(true);
    try {
      await loginWithUsername(data.username, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await googleLogin();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="space-y-6">
        <div>
          <Button 
            variant="outline" 
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <FaGoogle className="mr-2 mt-0.5" /> 
            Sign in with Google
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        
        <Tabs defaultValue="email" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="username">Username</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <div className="mt-1">
                  <Input
                    id="email"
                    {...emailForm.register("email")}
                    type="email"
                    autoComplete="email"
                    className={emailForm.formState.errors.email ? "border-red-500" : ""}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{emailForm.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="password-email" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="mt-1">
                  <Input
                    id="password-email"
                    {...emailForm.register("password")}
                    type="password"
                    autoComplete="current-password"
                    className={emailForm.formState.errors.password ? "border-red-500" : ""}
                  />
                  {emailForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-600">{emailForm.formState.errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="remember-me-email"
                    {...emailForm.register("rememberMe")}
                  />
                  <Label htmlFor="remember-me-email" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </Label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-blue-700">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="username">
            <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </Label>
                <div className="mt-1">
                  <Input
                    id="username"
                    {...usernameForm.register("username")}
                    type="text"
                    autoComplete="username"
                    className={usernameForm.formState.errors.username ? "border-red-500" : ""}
                  />
                  {usernameForm.formState.errors.username && (
                    <p className="mt-1 text-sm text-red-600">{usernameForm.formState.errors.username.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="password-username" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="mt-1">
                  <Input
                    id="password-username"
                    {...usernameForm.register("password")}
                    type="password"
                    autoComplete="current-password"
                    className={usernameForm.formState.errors.password ? "border-red-500" : ""}
                  />
                  {usernameForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-600">{usernameForm.formState.errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="remember-me-username"
                    {...usernameForm.register("rememberMe")}
                  />
                  <Label htmlFor="remember-me-username" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </Label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-blue-700">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <div className="text-center text-sm mt-6">
            <a href="#" className="font-medium text-primary hover:text-blue-700">
              Don't have an account? Sign up
            </a>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
