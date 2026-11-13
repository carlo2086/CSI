interface Props {
  tipo: "error" | "exito" | "info";
  texto: string;
}

export function Message({ tipo, texto }: Props) {
  return <p role={tipo === "error" ? "alert" : "status"} className={`msg msg-${tipo}`}>{texto}</p>;
}