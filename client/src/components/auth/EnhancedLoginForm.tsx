import { useState, useEffect } from "react";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth.tsx";
import { useFormValidation, validators } from "@/hooks/use-form-validation";
import { ValidatedInput } from "@/components/ui/form-feedback";
import { FormResult } from "@/components/ui/form-result";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaGoogle } from "react-icons/fa";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function EnhancedLoginForm() {
  const { login, loginWithUsername, googleLogin } = useAuth();
  const [activeTab, setActiveTab] = useState("email");
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [showUsernamePassword, setShowUsernamePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formResult, setFormResult] = useState<{
    type: 'success' | 'error' | 'loading' | null;
    message: string | null;
  }>({
    type: null,
    message: null
  });

  // Email form validation
  const emailValidation = useFormValidation({
    email: '',
    password: '',
    rememberMe: false
  }, {
    email: [
      validators.required('Email is required'),
      validators.email('Please enter a valid email address')
    ],
    password: [
      validators.required('Password is required'),
      validators.minLength(6, 'Password must be at least 6 characters')
    ]
  });

  // Username form validation
  const usernameValidation = useFormValidation({
    username: '',
    password: '',
    rememberMe: false
  }, {
    username: [
      validators.required('Username is required'),
      validators.minLength(3, 'Username must be at least 3 characters')
    ],
    password: [
      validators.required('Password is required'),
      validators.minLength(6, 'Password must be at least 6 characters')
    ]
  });

  // Clear form errors when switching tabs
  useEffect(() => {
    if (activeTab === 'email') {
      usernameValidation.resetForm();
    } else {
      emailValidation.resetForm();
    }
    
    setFormResult({ type: null, message: null });
  }, [activeTab]);

  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setFormResult({ 
      type: 'loading', 
      message: 'Connecting to Google...' 
    });
    
    try {
      await googleLogin();
      setFormResult({
        type: 'success',
        message: 'Successfully logged in with Google.'
      });
    } catch (error) {
      setFormResult({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to sign in with Google'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email login
  const handleEmailLogin = async (values: any) => {
    setIsLoading(true);
    setFormResult({ 
      type: 'loading', 
      message: 'Signing in...' 
    });
    
    try {
      await login(values.email, values.password);
      setFormResult({
        type: 'success',
        message: 'Successfully logged in!'
      });
    } catch (error) {
      setFormResult({
        type: 'error',
        message: error instanceof Error ? error.message : 'Login failed'
      });
      
      // Trigger shake animation on error
      document.querySelectorAll('input').forEach(input => {
        input.classList.add('input-error');
        setTimeout(() => {
          input.classList.remove('input-error');
        }, 500);
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle username login
  const handleUsernameLogin = async (values: any) => {
    setIsLoading(true);
    setFormResult({ 
      type: 'loading', 
      message: 'Signing in...' 
    });
    
    try {
      await loginWithUsername(values.username, values.password);
      setFormResult({
        type: 'success',
        message: 'Successfully logged in!'
      });
    } catch (error) {
      setFormResult({
        type: 'error',
        message: error instanceof Error ? error.message : 'Login failed'
      });
      
      // Trigger shake animation on error
      document.querySelectorAll('input').forEach(input => {
        input.classList.add('input-error');
        setTimeout(() => {
          input.classList.remove('input-error');
        }, 500);
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="space-y-6">
        {/* Google Login Button */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            variant="outline" 
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading && formResult.type === 'loading' && formResult.message?.includes('Google') && 
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            }
            <FaGoogle className="mr-2 h-4 w-4" /> 
            Sign in with Google
          </Button>
        </motion.div>
        
        {/* Divider */}
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
        
        {/* Form Result Message */}
        <AnimatePresence>
          {formResult.type && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <FormResult 
                type={formResult.type} 
                message={formResult.message || ''} 
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Login Tabs */}
        <Tabs defaultValue="email" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="username">Username</TabsTrigger>
          </TabsList>
          
          {/* Email Login Form */}
          <TabsContent value="email">
            <form onSubmit={emailValidation.handleSubmit(handleEmailLogin)} className="space-y-6">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <div className="mt-1">
                  <ValidatedInput
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={emailValidation.fields.email.value}
                    onChange={(e) => emailValidation.handleChange('email', e.target.value)}
                    onFocus={() => emailValidation.handleFocus('email')}
                    onBlur={() => emailValidation.handleBlur('email')}
                    isValid={emailValidation.fields.email.touched && emailValidation.fields.email.valid}
                    isInvalid={emailValidation.fields.email.touched && !emailValidation.fields.email.valid}
                    validationMessage={emailValidation.fields.email.error || undefined}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password-email" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="mt-1 relative">
                  <ValidatedInput
                    id="password-email"
                    type={showEmailPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={emailValidation.fields.password.value}
                    onChange={(e) => emailValidation.handleChange('password', e.target.value)}
                    onFocus={() => emailValidation.handleFocus('password')}
                    onBlur={() => emailValidation.handleBlur('password')}
                    isValid={emailValidation.fields.password.touched && emailValidation.fields.password.valid}
                    isInvalid={emailValidation.fields.password.touched && !emailValidation.fields.password.valid}
                    validationMessage={emailValidation.fields.password.error || undefined}
                    className="pr-10"
                    required
                  />
                  
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                    onClick={() => setShowEmailPassword(!showEmailPassword)}
                    aria-label={showEmailPassword ? "Hide password" : "Show password"}
                  >
                    {showEmailPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </motion.button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="remember-me-email"
                    checked={Boolean(emailValidation.fields.rememberMe.value)}
                    onCheckedChange={(checked) => 
                      emailValidation.handleChange('rememberMe', checked ? 'true' : 'false')
                    }
                  />
                  <Label htmlFor="remember-me-email" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </Label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4"
                  disabled={isLoading}
                >
                  {isLoading && formResult.type === 'loading' && !formResult.message?.includes('Google') && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading && formResult.type === 'loading' && !formResult.message?.includes('Google') 
                    ? "Signing in..." 
                    : "Sign in"
                  }
                </Button>
              </motion.div>
            </form>
          </TabsContent>
          
          {/* Username Login Form */}
          <TabsContent value="username">
            <form onSubmit={usernameValidation.handleSubmit(handleUsernameLogin)} className="space-y-6">
              <div>
                <Label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </Label>
                <div className="mt-1">
                  <ValidatedInput
                    id="username"
                    type="text"
                    placeholder="yourusername"
                    value={usernameValidation.fields.username.value}
                    onChange={(e) => usernameValidation.handleChange('username', e.target.value)}
                    onFocus={() => usernameValidation.handleFocus('username')}
                    onBlur={() => usernameValidation.handleBlur('username')}
                    isValid={usernameValidation.fields.username.touched && usernameValidation.fields.username.valid}
                    isInvalid={usernameValidation.fields.username.touched && !usernameValidation.fields.username.valid}
                    validationMessage={usernameValidation.fields.username.error || undefined}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password-username" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="mt-1 relative">
                  <ValidatedInput
                    id="password-username"
                    type={showUsernamePassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={usernameValidation.fields.password.value}
                    onChange={(e) => usernameValidation.handleChange('password', e.target.value)}
                    onFocus={() => usernameValidation.handleFocus('password')}
                    onBlur={() => usernameValidation.handleBlur('password')}
                    isValid={usernameValidation.fields.password.touched && usernameValidation.fields.password.valid}
                    isInvalid={usernameValidation.fields.password.touched && !usernameValidation.fields.password.valid}
                    validationMessage={usernameValidation.fields.password.error || undefined}
                    className="pr-10"
                    required
                  />
                  
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                    onClick={() => setShowUsernamePassword(!showUsernamePassword)}
                    aria-label={showUsernamePassword ? "Hide password" : "Show password"}
                  >
                    {showUsernamePassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </motion.button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="remember-me-username"
                    checked={Boolean(usernameValidation.fields.rememberMe.value)}
                    onCheckedChange={(checked) => 
                      usernameValidation.handleChange('rememberMe', checked ? 'true' : 'false')
                    }
                  />
                  <Label htmlFor="remember-me-username" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </Label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4"
                  disabled={isLoading}
                >
                  {isLoading && formResult.type === 'loading' && !formResult.message?.includes('Google') && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading && formResult.type === 'loading' && !formResult.message?.includes('Google') 
                    ? "Signing in..." 
                    : "Sign in"
                  }
                </Button>
              </motion.div>
            </form>
          </TabsContent>
          
          <div className="text-center text-sm mt-6">
            <a href="#" className="font-medium text-primary hover:text-primary/80">
              Don't have an account? Sign up
            </a>
          </div>
        </Tabs>
      </div>
    </div>
  );
}