import { Icon } from "./Icon";

interface Props {
  valor: string;
  onChange: (valor: string) => void;
  placeholder?: string;
}

export function SearchBar({ valor, onChange, placeholder = "Buscar..." }: Props) {
  return (
    <div className="input-wrap">
      <Icon name="search" />
      <input
        type="search"
        className="input"
        autoComplete="off"
        aria-label={placeholder}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
