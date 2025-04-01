import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type ValidationStatus = "success" | "error" | "warning" | "neutral";

interface FormFeedbackProps {
  status: ValidationStatus;
  message?: string;
  showIcon?: boolean;
  className?: string;
}

export function FormFeedback({ 
  status = "neutral", 
  message, 
  showIcon = true,
  className 
}: FormFeedbackProps) {
  const [visible, setVisible] = useState(false);
  
  // Ensure animation triggers when message changes
  useEffect(() => {
    if (message) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [message]);

  // No need to render if no message and neutral status
  if (!message && status === "neutral") return null;

  // Determine icon and styles based on status
  const getIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  // Style classes based on status
  const statusClasses = {
    success: "text-green-600 bg-green-50 border-green-200",
    error: "text-destructive bg-destructive/10 border-destructive/20",
    warning: "text-amber-600 bg-amber-50 border-amber-200",
    neutral: "text-muted-foreground bg-muted/30 border-muted"
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -5, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -5, height: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "text-xs rounded-md px-2 py-1 mt-1 flex items-center gap-1.5 border",
            statusClasses[status],
            className
          )}
        >
          {showIcon && getIcon()}
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Input field with validation animation
interface ValidatedInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isValid?: boolean;
  isInvalid?: boolean;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  validationMessage?: string;
  required?: boolean;
  disabled?: boolean;
}

export function ValidatedInput({
  id,
  value,
  onChange,
  onFocus,
  onBlur,
  isValid = false,
  isInvalid = false,
  label,
  placeholder,
  type = "text",
  className,
  validationMessage,
  required = false,
  disabled = false
}: ValidatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };
  
  // Determine the validation status
  const getValidationStatus = (): ValidationStatus => {
    if (isValid) return "success";
    if (isInvalid) return "error";
    return "neutral";
  };
  
  // Determine border color based on validation and focus state
  const borderClass = cn(
    "border transition-all duration-200 ease-in-out rounded-md px-3 py-2 text-sm w-full",
    {
      "border-input": !isValid && !isInvalid && !isFocused,
      "border-green-400 ring-1 ring-green-200": isValid,
      "border-destructive ring-1 ring-destructive/20": isInvalid,
      "border-primary ring-1 ring-primary/10": isFocused && !isValid && !isInvalid,
    },
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium mb-1.5"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={borderClass}
          disabled={disabled}
          required={required}
        />
        
        {/* Icon indicator for validation state */}
        <AnimatePresence>
          {(isValid || isInvalid) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {isValid && <CheckCircle className="h-4 w-4 text-green-500" />}
              {isInvalid && <XCircle className="h-4 w-4 text-destructive" />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Validation message */}
      <FormFeedback
        status={getValidationStatus()}
        message={validationMessage}
      />
    </div>
  );
}