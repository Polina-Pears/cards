import type { ButtonHTMLAttributes } from "react";
import style from "./Button.module.scss";

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
    fullWidth?: boolean;
    loading?: boolean;
};

const variantStyles: Record<Variant, string> = {
    primary: style.primary,
    secondary: style.secondary,
};

const sizeStyles: Record<Size, string> = {
    sm: style.sm,
    md: style.md,
    lg: style.lg,
};

export type { ButtonProps, Variant, Size };
export { variantStyles, sizeStyles };