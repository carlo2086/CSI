import type { ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router-dom";

type Variante = "primario" | "secundario" | "peligro" | "exito" | "ghost-danger";
type Tamano = "sm" | "md" | "lg";

function clases(variante: Variante, tamano: Tamano, bloque: boolean, extra: string) {
  return ["btn", `btn-${variante}`, tamano !== "md" && `btn-${tamano}`, bloque && "btn-block", extra]
    .filter(Boolean)
    .join(" ");
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  tamano?: Tamano;
  bloque?: boolean;
}

export function Button({ variante = "primario", tamano = "md", bloque = false, className = "", ...rest }: Props) {
  return <button {...rest} className={clases(variante, tamano, bloque, className)} />;
}

interface LinkButtonProps extends LinkProps {
  variante?: Variante;
  tamano?: Tamano;
  bloque?: boolean;
}

/** Enlace con aspecto de botón (evita anidar <button> dentro de <a>). */
export function ButtonLink({ variante = "primario", tamano = "md", bloque = false, className = "", ...rest }: LinkButtonProps) {
  return <Link {...rest} className={clases(variante, tamano, bloque, className)} />;
}
