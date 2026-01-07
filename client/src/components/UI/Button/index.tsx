// import { type ButtonHTMLAttributes, type CSSProperties } from "react";
import styles  from "./Button.module.scss";
import classNames from "classnames";
import { sizeStyles, variantStyles, type ButtonProps } from "./Button.config";


const Button = ({
    children,
    variant = "primary",
    size = "md",
    fullWidth,
    loading,
    disabled,
    style,
    className,
    type,
    ...rest
}: ButtonProps) => {
    const classVariant = variantStyles[variant];
    const classSizing = sizeStyles[size];
    const isDisabled = disabled || loading;

    return (
        <button
            {...rest}
            type={type ?? "button"}
            className={classNames(
                className, 
                styles.button,
                classVariant, 
                classSizing, 
                { 
                    [styles.loading]: loading, 
                    [styles.disabled]: isDisabled ,
                    [styles.fullWidth]: fullWidth
                }
            )}
            disabled={isDisabled}
            aria-busy={Boolean(loading)}
        >
            {loading ? "Loading..." : children}
        </button>
    );
};

export default Button;
