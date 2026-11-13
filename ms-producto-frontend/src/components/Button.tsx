import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "primario" | "peligro";
}

export function Button({ variante = "primario", ...rest }: Props) {
  return (
    <button
      {...rest}
      style={{
        background: `var(--color-${variante})`,
        color: "white",
        border: "none",
        borderRadius: "var(--radio)",
        padding: "0.5rem 1rem",
        cursor: "pointer",
      }}
    />
  );
}