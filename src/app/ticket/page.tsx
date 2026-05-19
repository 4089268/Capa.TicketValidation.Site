import { TicketCard, type TicketData } from "@/components/TicketCard";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function getString(value: string | string[] | undefined, fallback: string): string {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

function formatearFecha(fecha: string): string {
  if (fecha.length === 8) {
    const year = fecha.substring(0, 4);
    const month = fecha.substring(4, 6);
    const day = fecha.substring(6, 8);
    return `${year}-${month}-${day}`;
  }
  return fecha;
}

export default async function TicketPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const montoRaw = parseFloat(getString(params.t, "0"));
  const fechaRaw = getString(params.f, new Date().toISOString().split("T")[0]);

  const ticketData: TicketData = {
    nombre: getString(params.n, "Cliente"),
    cuenta: getString(params.c, ""),
    fecha: formatearFecha(fechaRaw),
    monto: isNaN(montoRaw) ? 0 : montoRaw,
    folio: getString(params.i, ""),
    hash: getString(params.h, ""),
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <TicketCard {...ticketData} />
    </main>
  );
}

