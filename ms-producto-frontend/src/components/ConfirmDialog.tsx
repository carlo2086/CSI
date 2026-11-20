import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";

interface Props {
  abierto: boolean;
  titulo: string;
  children: ReactNode;
  nota?: string;
  textoConfirmar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmDialog({ abierto, titulo, children, nota, textoConfirmar = "Confirmar", onConfirmar, onCancelar }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  return (
    <dialog ref={ref} aria-labelledby="confirm-titulo" onCancel={(e) => { e.preventDefault(); onCancelar(); }}>
      <div className="modal-head">
        <div className="modal-icon"><Icon name="warning" size="lg" /></div>
        <div style={{ flex: 1 }}>
          <h3 id="confirm-titulo">{titulo}</h3>
          <div className="muted" style={{ marginTop: "0.5rem" }}>{children}</div>
        </div>
      </div>
      {nota && (
        <div className="modal-body">
          <div className="modal-note"><Icon name="info" size="sm" />{nota}</div>
        </div>
      )}
      <div className="modal-foot">
        <Button variante="secundario" onClick={onCancelar} autoFocus>Cancelar</Button>
        <Button variante="peligro" onClick={onConfirmar}><Icon name="block" size="sm" />{textoConfirmar}</Button>
      </div>
    </dialog>
  );
}
