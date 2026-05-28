export const OFICINAS: Record<string, string> = {
  "401": "OTHON P. BLANCO",
  "404": "BACALAR",
  "403": "FELIPE CARRILLO PUERTO",
  "405": "JOSE MARIA MORELOS",
  "402": "TULUM",
  "407": "COZUMEL",
  "406": "LAZARO CARDENAS",
};

export function getOficinaNombre(idOficina: string): string {
  return OFICINAS[idOficina] || idOficina;
}
