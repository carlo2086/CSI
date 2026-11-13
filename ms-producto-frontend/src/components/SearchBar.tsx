interface Props {
  valor: string;
  onChange: (valor: string) => void;
  placeholder?: string;
}

export function SearchBar({ valor, onChange, placeholder = "Buscar..." }: Props) {
  return (
    <input
      type="search"
      value={valor}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}