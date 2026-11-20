import { Icon } from "./Icon";

interface Props {
  tipo: "error" | "exito" | "info";
  texto: string;
  titulo?: string;
  onCerrar?: () => void;
}

const ICONOS = { error: "error", exito: "check_circle", info: "info" } as const;

export function Message({ tipo, texto, titulo, onCerrar }: Props) {
  return (
    <div role={tipo === "error" ? "alert" : "status"} className={`alert alert-${tipo}`}>
      <Icon name={ICONOS[tipo]} />
      <div className="alert-body">
        {titulo && <div><strong>{titulo}</strong></div>}
        <div>{texto}</div>
      </div>
      {onCerrar && (
        <button type="button" className="icon-btn" aria-label="Cerrar mensaje" onClick={onCerrar}>
          <Icon name="close" size="sm" />
        </button>
      )}
    </div>
  );
}
