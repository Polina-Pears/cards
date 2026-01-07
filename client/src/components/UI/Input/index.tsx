import { useId, type InputHTMLAttributes } from "react";
import classNames from "classnames";
import style from './input.module.scss'


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
        <div className={classNames(containerClassName, style.container)}>
            { label && ( <label htmlFor={inputId}>{label}</label> ) }
            <input
                {...rest}
                id={inputId}
                className={classNames(className, style.input)}
                aria-invalid={Boolean(error)}
                aria-describedby={assistiveId}

            />
            { errorMessage ? (
                <div id={assistiveId} className={style.error}>
                    {errorMessage}
                </div>
            ) : helperText ? (
                <div id={assistiveId} >
                    {helperText}
                </div>
            ) : null}
        </div>
    );
};

export default Input;
