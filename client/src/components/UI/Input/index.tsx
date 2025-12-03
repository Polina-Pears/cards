import { useId, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    helperText?: string;
    error?: string | boolean;
    containerClassName?: string;
    fullWidth?: boolean;
};

const Input = ({
    label,
    helperText,
    error,
    containerClassName,
    fullWidth,
    className,
    id,
    ...rest
}: InputProps) => {
    const fallbackId = useId();
    const inputId = id ?? fallbackId;
    const errorMessage = typeof error === "string" ? error : error ? "Error" : undefined;
    const assistiveId = errorMessage || helperText ? `${inputId}-assistive` : undefined;

    return (
        <div className={containerClassName}>
            {label && (
                <label
                    htmlFor={inputId}
                    style={{ display: "block", marginBottom: 4, fontWeight: 600 }}
                >
                    {label}
                </label>
            )}
            <input
                {...rest}
                id={inputId}
                className={className}
                aria-invalid={Boolean(error)}
                aria-describedby={assistiveId}
            />
            { errorMessage ? (
                <div
                    id={assistiveId}
                >
                    {errorMessage}
                </div>
            ) : helperText ? (
                <div
                    id={assistiveId}
                >
                    {helperText}
                </div>
            ) : null}
        </div>
    );
};

export default Input;
