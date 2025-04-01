import { useState, useEffect } from "react";
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
import { 
  EyeIcon, 
  EyeOffIcon, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2
} from "lucide-react";

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
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [showUsernamePassword, setShowUsernamePassword] = useState(false);
  
  // Validation state for email form
  const [emailState, setEmailState] = useState<'initial' | 'valid' | 'invalid' | 'checking'>('initial');
  const [passwordEmailState, setPasswordEmailState] = useState<'initial' | 'valid' | 'invalid'>('initial');
  
  // Validation state for username form
  const [usernameState, setUsernameState] = useState<'initial' | 'valid' | 'invalid' | 'checking'>('initial');
  const [passwordUsernameState, setPasswordUsernameState] = useState<'initial' | 'valid' | 'invalid'>('initial');
  
  // Login error states
  const [emailLoginError, setEmailLoginError] = useState<string | null>(null);
  const [usernameLoginError, setUsernameLoginError] = useState<string | null>(null);

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
    },
    mode: "onChange"
  });
  
  // Watch for email input changes
  useEffect(() => {
    const subscription = emailForm.watch((value, { name }) => {
      if (name === 'email') {
        const email = value.email as string;
        
        if (!email || email.length === 0) {
          setEmailState('initial');
          return;
        }
        
        // Email validation pattern
        setEmailState('checking');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Simulate a slight delay for the checking state to be visible
        const timer = setTimeout(() => {
          if (emailRegex.test(email)) {
            setEmailState('valid');
          } else {
            setEmailState('invalid');
          }
        }, 500);
        
        return () => clearTimeout(timer);
      }
      
      if (name === 'password') {
        const password = value.password as string;
        
        if (!password || password.length === 0) {
          setPasswordEmailState('initial');
          return;
        }
        
        if (password.length >= 6) {
          setPasswordEmailState('valid');
        } else {
          setPasswordEmailState('invalid');
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [emailForm, emailForm.watch]);
  
  // Watch for username input changes
  useEffect(() => {
    const subscription = usernameForm.watch((value, { name }) => {
      if (name === 'username') {
        const username = value.username as string;
        
        if (!username || username.length === 0) {
          setUsernameState('initial');
          return;
        }
        
        setUsernameState('checking');
        
        // Simulate a slight delay for the checking state to be visible
        const timer = setTimeout(() => {
          if (username.length >= 3) {
            setUsernameState('valid');
          } else {
            setUsernameState('invalid');
          }
        }, 500);
        
        return () => clearTimeout(timer);
      }
      
      if (name === 'password') {
        const password = value.password as string;
        
        if (!password || password.length === 0) {
          setPasswordUsernameState('initial');
          return;
        }
        
        if (password.length >= 6) {
          setPasswordUsernameState('valid');
        } else {
          setPasswordUsernameState('invalid');
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [usernameForm, usernameForm.watch]);

  // Clear form errors when switching tabs
  useEffect(() => {
    if (activeTab === 'email') {
      setUsernameLoginError(null);
      usernameForm.clearErrors();
    } else {
      setEmailLoginError(null);
      emailForm.clearErrors();
    }
  }, [activeTab, emailForm, usernameForm]);

  const onEmailSubmit = async (data: EmailLoginFormValues) => {
    setIsLoading(true);
    setEmailLoginError(null);
    
    try {
      await login(data.email, data.password);
    } catch (error) {
      // Display error with animation
      setEmailLoginError(error instanceof Error ? error.message : "Login failed");
      setEmailState('invalid');
      setPasswordEmailState('invalid');
      
      // Add the shake animation classes
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password-email');
      
      if (emailInput) emailInput.classList.add('input-error');
      if (passwordInput) passwordInput.classList.add('input-error');
      
      // Remove the animation classes after it completes
      setTimeout(() => {
        if (emailInput) emailInput.classList.remove('input-error');
        if (passwordInput) passwordInput.classList.remove('input-error');
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const onUsernameSubmit = async (data: UsernameLoginFormValues) => {
    setIsLoading(true);
    setUsernameLoginError(null);
    
    try {
      await loginWithUsername(data.username, data.password);
    } catch (error) {
      // Display error with animation
      setUsernameLoginError(error instanceof Error ? error.message : "Login failed");
      setUsernameState('invalid');
      setPasswordUsernameState('invalid');
      
      // Add the shake animation classes
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password-username');
      
      if (usernameInput) usernameInput.classList.add('input-error');
      if (passwordInput) passwordInput.classList.add('input-error');
      
      // Remove the animation classes after it completes
      setTimeout(() => {
        if (usernameInput) usernameInput.classList.remove('input-error');
        if (passwordInput) passwordInput.classList.remove('input-error');
      }, 500);
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
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                <div className="mt-1 relative">
                  <Input
                    id="email"
                    {...emailForm.register("email")}
                    type="email"
                    autoComplete="email"
                    className={
                      emailState === 'valid' 
                        ? 'input-success' 
                        : emailState === 'invalid' || emailForm.formState.errors.email 
                          ? 'input-error' 
                          : emailState === 'checking' 
                            ? 'input-checking' 
                            : ''
                    }
                  />
                  
                  {/* Validation icon */}
                  {emailState !== 'initial' && (
                    <div className="feedback-icon">
                      {emailState === 'valid' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      {emailState === 'invalid' && <XCircle className="h-5 w-5 text-red-500" />}
                      {emailState === 'checking' && <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />}
                    </div>
                  )}
                  
                  {emailForm.formState.errors.email && (
                    <p className="error-message">{emailForm.formState.errors.email.message}</p>
                  )}
                  
                  {emailLoginError && (
                    <p className="error-message">{emailLoginError}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="password-email" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="password-email"
                    {...emailForm.register("password")}
                    type={showEmailPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={
                      passwordEmailState === 'valid' 
                        ? 'input-success' 
                        : passwordEmailState === 'invalid' || emailForm.formState.errors.password 
                          ? 'input-error' 
                          : ''
                    }
                  />
                  
                  {/* Password visibility toggle */}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                    onClick={() => setShowEmailPassword(!showEmailPassword)}
                  >
                    {showEmailPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                  
                  {/* Validation icon - positioned to the left of the eye icon */}
                  {passwordEmailState !== 'initial' && (
                    <div className="absolute inset-y-0 right-10 flex items-center">
                      {passwordEmailState === 'valid' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      {passwordEmailState === 'invalid' && <XCircle className="h-5 w-5 text-red-500" />}
                    </div>
                  )}
                  
                  {emailForm.formState.errors.password && (
                    <p className="error-message">{emailForm.formState.errors.password.message}</p>
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
                  className="w-full flex justify-center items-center py-2 px-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                <div className="mt-1 relative">
                  <Input
                    id="username"
                    {...usernameForm.register("username")}
                    type="text"
                    autoComplete="username"
                    className={
                      usernameState === 'valid' 
                        ? 'input-success' 
                        : usernameState === 'invalid' || usernameForm.formState.errors.username 
                          ? 'input-error' 
                          : usernameState === 'checking' 
                            ? 'input-checking' 
                            : ''
                    }
                  />
                  
                  {/* Validation icon */}
                  {usernameState !== 'initial' && (
                    <div className="feedback-icon">
                      {usernameState === 'valid' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      {usernameState === 'invalid' && <XCircle className="h-5 w-5 text-red-500" />}
                      {usernameState === 'checking' && <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />}
                    </div>
                  )}
                  
                  {usernameForm.formState.errors.username && (
                    <p className="error-message">{usernameForm.formState.errors.username.message}</p>
                  )}
                  
                  {usernameLoginError && (
                    <p className="error-message">{usernameLoginError}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="password-username" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="password-username"
                    {...usernameForm.register("password")}
                    type={showUsernamePassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={
                      passwordUsernameState === 'valid' 
                        ? 'input-success' 
                        : passwordUsernameState === 'invalid' || usernameForm.formState.errors.password 
                          ? 'input-error' 
                          : ''
                    }
                  />
                  
                  {/* Password visibility toggle */}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                    onClick={() => setShowUsernamePassword(!showUsernamePassword)}
                  >
                    {showUsernamePassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                  
                  {/* Validation icon - positioned to the left of the eye icon */}
                  {passwordUsernameState !== 'initial' && (
                    <div className="absolute inset-y-0 right-10 flex items-center">
                      {passwordUsernameState === 'valid' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      {passwordUsernameState === 'invalid' && <XCircle className="h-5 w-5 text-red-500" />}
                    </div>
                  )}
                  
                  {usernameForm.formState.errors.password && (
                    <p className="error-message">{usernameForm.formState.errors.password.message}</p>
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
                  className="w-full flex justify-center items-center py-2 px-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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