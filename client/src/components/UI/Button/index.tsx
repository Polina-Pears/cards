import { type ButtonHTMLAttributes, type CSSProperties } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
    fullWidth?: boolean;
    loading?: boolean;
};

const variantStyles: Record<
    Variant,
    { background: string; color: string; border: string }
> = {
    primary: { background: "#2563eb", color: "#ffffff", border: "#1d4ed8" },
    secondary: { background: "#e5e7eb", color: "#111827", border: "#d1d5db" },
    ghost: { background: "transparent", color: "#1f2937", border: "#d1d5db" },
};

const sizeStyles: Record<Size, { padding: string; fontSize: string }> = {
    sm: { padding: "6px 12px", fontSize: "14px" },
    md: { padding: "8px 14px", fontSize: "15px" },
    lg: { padding: "10px 16px", fontSize: "16px" },
};

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
    const palette = variantStyles[variant];
    const sizing = sizeStyles[size];
    const isDisabled = disabled || loading;

    const buttonStyle: CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 8,
        fontWeight: 600,
        border: `1px solid ${palette.border}`,
        background: palette.background,
        color: palette.color,
        padding: sizing.padding,
        fontSize: sizing.fontSize,
        width: fullWidth ? "100%" : undefined,
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.6 : 1,
        transition: "background-color 0.15s ease, border-color 0.15s ease",
        ...style,
    };

    return (
        <button
            {...rest}
            type={type ?? "button"}
            className={className}
            style={buttonStyle}
            disabled={isDisabled}
            aria-busy={Boolean(loading)}
        >
            {loading ? "Loading..." : children}
        </button>
    );
};

export default Button;
