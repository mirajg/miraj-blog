
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "danger";
};

const styles = {
  primary: "bg-foreground text-background hover:opacity-80",
  outline: "border hover:opacity-70",
  danger: "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
};

export default function Button({
  variant = "primary",
  type = "button", // pass type="submit" explicitly for form buttons
  className = "",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={`rounded px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}