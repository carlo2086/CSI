const BASE_URL = import.meta.env.VITE_API_URL;

interface ErrorBody {
  mensaje?: string;
  detalles?: string[];
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    let mensaje = `Error ${response.status}: ${response.statusText}`;
    try {
      const body = (await response.json()) as ErrorBody;
      if (body.mensaje) {
        mensaje = body.detalles?.length ? `${body.mensaje}: ${body.detalles.join(", ")}` : body.mensaje;
      }
    } catch {
      // cuerpo no JSON: se conserva el mensaje genérico
    }
    throw new Error(mensaje);
  }
  // DELETE responde 204 sin cuerpo
  return response.status === 204 ? (undefined as T) : response.json();
}
