'use client';

import { useState, useCallback } from 'react';

export interface ValidationRule {
    validator: (value: string) => boolean;
    message: string;
}

export interface FieldValidation {
    [key: string]: ValidationRule[];
}

export interface ValidationErrors {
    [key: string]: string;
}

export interface UseFormValidationReturn {
    errors: ValidationErrors;
    touched: { [key: string]: boolean };
    validateField: (field: string, value: string) => string | null;
    validateForm: (values: { [key: string]: string }) => boolean;
    setFieldTouched: (field: string, touched: boolean) => void;
    setFieldError: (field: string, error: string | null) => void;
    clearErrors: () => void;
    clearFieldError: (field: string) => void;
}

export const useFormValidation = (
    rules: FieldValidation
): UseFormValidationReturn => {
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

    const validateField = useCallback(
        (field: string, value: string): string | null => {
            const fieldRules = rules[field];
            if (!fieldRules) return null;

            for (const rule of fieldRules) {
                if (!rule.validator(value)) {
                    return rule.message;
                }
            }

            return null;
        },
        [rules]
    );

    const validateForm = useCallback(
        (values: { [key: string]: string }): boolean => {
            const newErrors: ValidationErrors = {};
            let isValid = true;

            Object.keys(rules).forEach((field) => {
                const error = validateField(field, values[field] || '');
                if (error) {
                    newErrors[field] = error;
                    isValid = false;
                }
            });

            setErrors(newErrors);
            
            // Mark all fields as touched
            const newTouched: { [key: string]: boolean } = {};
            Object.keys(rules).forEach((field) => {
                newTouched[field] = true;
            });
            setTouched(newTouched);

            return isValid;
        },
        [rules, validateField]
    );

    const setFieldTouched = useCallback((field: string, isTouched: boolean) => {
        setTouched((prev) => ({ ...prev, [field]: isTouched }));
    }, []);

    const setFieldError = useCallback((field: string, error: string | null) => {
        setErrors((prev) => {
            if (error === null) {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            }
            return { ...prev, [field]: error };
        });
    }, []);

    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    const clearFieldError = useCallback((field: string) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    return {
        errors,
        touched,
        validateField,
        validateForm,
        setFieldTouched,
        setFieldError,
        clearErrors,
        clearFieldError,
    };
};

// Common validation rules
export const validationRules = {
    required: (message = 'Trường này là bắt buộc'): ValidationRule => ({
        validator: (value) => value.trim().length > 0,
        message,
    }),

    minLength: (min: number, message?: string): ValidationRule => ({
        validator: (value) => value.length >= min,
        message: message || `Tối thiểu ${min} ký tự`,
    }),

    maxLength: (max: number, message?: string): ValidationRule => ({
        validator: (value) => value.length <= max,
        message: message || `Tối đa ${max} ký tự`,
    }),

    email: (message = 'Email không hợp lệ'): ValidationRule => ({
        validator: (value) => {
            if (!value) return true; // Allow empty if not required
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        },
        message,
    }),

    match: (otherValue: string, message = 'Giá trị không khớp'): ValidationRule => ({
        validator: (value) => value === otherValue,
        message,
    }),

    pattern: (pattern: RegExp, message: string): ValidationRule => ({
        validator: (value) => {
            if (!value) return true; // Allow empty if not required
            return pattern.test(value);
        },
        message,
    }),
};

