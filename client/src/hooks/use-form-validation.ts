import { useState, useEffect } from 'react';

export type FieldState = {
  value: string;
  touched: boolean;
  focused: boolean;
  valid: boolean;
  error: string | null;
  showSuccess: boolean;
};

export type FieldValidator = (value: string) => string | null;

export type FormFields<T extends Record<string, any>> = {
  [K in keyof T]: FieldState;
};

export type ValidationRules<T extends Record<string, any>> = {
  [K in keyof T]?: FieldValidator[];
};

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>
) {
  // Create the initial state for each field
  const initialFieldsState = Object.keys(initialValues).reduce((acc, key) => {
    acc[key as keyof T] = {
      value: initialValues[key as keyof T] || '',
      touched: false,
      focused: false,
      valid: true,
      error: null,
      showSuccess: false,
    };
    return acc;
  }, {} as FormFields<T>);

  const [fields, setFields] = useState<FormFields<T>>(initialFieldsState);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handler for updating a field value
  const handleChange = (name: keyof T, value: string) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        // When editing a field after it's been touched, re-validate
        ...(prev[name].touched ? validateField(name, value) : {}),
      }
    }));
  };

  // Handler for when a field gets focus
  const handleFocus = (name: keyof T) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        focused: true
      }
    }));
  };

  // Handler for when a field loses focus
  const handleBlur = (name: keyof T) => {
    const value = fields[name].value;
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched: true,
        focused: false,
        ...validateField(name, value),
      }
    }));
  };

  // Validate a single field
  const validateField = (name: keyof T, value: string) => {
    const validators = validationRules[name] || [];
    
    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        return { valid: false, error, showSuccess: false };
      }
    }
    
    // If we reach here, the field is valid
    return { valid: true, error: null, showSuccess: true };
  };

  // Validate the entire form
  const validateForm = () => {
    let isValid = true;
    const updatedFields = { ...fields };

    // Validate each field and mark as touched
    Object.keys(updatedFields).forEach(key => {
      const fieldName = key as keyof T;
      const field = updatedFields[fieldName];
      const value = field.value;
      
      const validationResult = validateField(fieldName, value);
      
      updatedFields[fieldName] = {
        ...field,
        touched: true,
        ...validationResult
      };

      if (!validationResult.valid) {
        isValid = false;
      }
    });

    setFields(updatedFields);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (callback: (values: T) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      setFormSubmitted(true);
      
      const isValid = validateForm();
      setIsFormValid(isValid);
      
      if (isValid) {
        // Convert back to original form values
        const formValues = Object.keys(fields).reduce((values, key) => {
          values[key as keyof T] = fields[key as keyof T].value as any;
          return values;
        }, {} as T);
        
        callback(formValues);
      }
    };
  };

  // Reset form to initial state
  const resetForm = () => {
    setFields(initialFieldsState);
    setIsFormValid(false);
    setFormSubmitted(false);
  };

  // Check form validity whenever fields change
  useEffect(() => {
    if (formSubmitted) {
      const valid = Object.values(fields).every(field => field.valid);
      setIsFormValid(valid);
    }
  }, [fields, formSubmitted]);

  return {
    fields,
    isFormValid,
    formSubmitted,
    handleChange,
    handleFocus,
    handleBlur,
    handleSubmit,
    validateForm,
    resetForm
  };
}

// Commonly used validators
export const validators = {
  required: (message = 'This field is required') => {
    return (value: string) => {
      return value.trim() ? null : message;
    };
  },
  
  minLength: (min: number, message?: string) => {
    return (value: string) => {
      return value.length >= min 
        ? null 
        : message || `Must be at least ${min} characters`;
    };
  },
  
  maxLength: (max: number, message?: string) => {
    return (value: string) => {
      return value.length <= max 
        ? null 
        : message || `Must be no more than ${max} characters`;
    };
  },
  
  email: (message = 'Please enter a valid email address') => {
    return (value: string) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(value) ? null : message;
    };
  },
  
  pattern: (regex: RegExp, message: string) => {
    return (value: string) => {
      return regex.test(value) ? null : message;
    };
  },
  
  match: (fieldToMatch: () => string, message: string) => {
    return (value: string) => {
      return value === fieldToMatch() ? null : message;
    };
  }
};