import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormResultProps {
  type: 'success' | 'error' | 'loading' | null;
  message?: string;
  className?: string;
}

export function FormResult({ 
  type, 
  message, 
  className 
}: FormResultProps) {
  if (!type) return null;

  const variants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: { opacity: 1, y: 0, height: 'auto' },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive shrink-0" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />;
      default:
        return null;
    }
  };

  const getClasses = () => {
    const baseClasses = "p-3 rounded-md border text-sm flex items-center gap-2.5";
    
    switch (type) {
      case 'success':
        return cn(baseClasses, "bg-green-50 border-green-200 text-green-800");
      case 'error':
        return cn(baseClasses, "bg-destructive/10 border-destructive/20 text-destructive");
      case 'loading':
        return cn(baseClasses, "bg-muted border-input text-foreground");
      default:
        return baseClasses;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={type}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
        className={cn(getClasses(), className)}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {getIcon()}
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}