import { Icon } from "./Icon";

interface Props {
  stockActual: number;
  stockBajo: boolean;
}

/** Estado de stock con ícono y texto (no depende sólo del color). */
export function StockBadge({ stockActual, stockBajo }: Props) {
  if (stockActual <= 0) {
    return <span className="badge badge-bajo"><Icon name="error" size="sm" />Agotado</span>;
  }
  if (stockBajo) {
    return <span className="badge badge-bajo"><Icon name="warning" size="sm" />Stock bajo</span>;
  }
  return <span className="badge badge-ok"><Icon name="check" size="sm" />Stock óptimo</span>;
}
