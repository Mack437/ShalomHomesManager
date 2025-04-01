import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function FormDemoPage() {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Simple email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValid(emailRegex.test(value));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };
  
  return (
    <div className="container max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Form Validation Demo</h1>
      
      {isSubmitted && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Form submitted successfully!</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full p-2 border rounded-md transition-colors ${
                email && isValid ? "border-green-500" : 
                email && !isValid ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="your@email.com"
              required
            />
            {email && (
              <div className="absolute inset-y-0 right-3 flex items-center">
                {isValid ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
                       fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
                       fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                )}
              </div>
            )}
          </div>
          {email && !isValid && (
            <p className="mt-1 text-xs text-red-500">
              Please enter a valid email address
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Type an email to see validation in action
          </p>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={!isValid}
        >
          Submit
        </Button>
      </form>
      
      <div className="mt-8 text-sm text-gray-500">
        <p className="text-center">
          This demo showcases basic form validation with visual feedback.
        </p>
      </div>
    </div>
  );
}