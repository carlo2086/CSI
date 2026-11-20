interface Props {
  name: string;
  size?: "sm" | "md" | "lg";
  fill?: boolean;
}

/** Ícono de Material Symbols (la fuente se carga desde index.html). */
export function Icon({ name, size = "md", fill = false }: Props) {
  const clase = ["material-symbols-outlined", size !== "md" && size, fill && "fill"].filter(Boolean).join(" ");
  return <span className={clase} aria-hidden="true">{name}</span>;
}
