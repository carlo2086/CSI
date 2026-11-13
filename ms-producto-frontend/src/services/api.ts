const BASE_URL = import.meta.env.VITE_API_URL;

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  // DELETE suele responder 204 sin cuerpo
  return response.status === 204 ? (undefined as T) : response.json();
}