import { TicketCard, type TicketData } from "@/components/TicketCard";
import { validateHash } from "@/lib/hashValidator";

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
  const rfcRaw = getString(params.s, "");
  const providedHash = getString(params.h, "");
  const hashKey = process.env.HASH_KEY || "";

  const nombre = getString(params.n, "Cliente");
  const idOficina = getString(params.o, "");
  const cuenta = getString(params.c, "");
  const folio = getString(params.i, "");
  // Usar el monto exactamente como viene en la URL (con decimales)
  const montoStr = getString(params.t, "0");

  // Validar hash con la fecha en formato YYYYMMDD (sin guiones)
  const hashValid = validateHash(
    nombre,
    idOficina,
    cuenta,
    getString(params.f, ""), // Usar fecha raw sin formato
    folio,
    montoStr, // Usar monto exacto de la URL
    rfcRaw, // Incluir "-" en el hash
    providedHash,
    hashKey
  );

  // Para mostrar: si RFC es "-", no mostrarlo
  const rfcDisplay = rfcRaw === "-" ? undefined : rfcRaw || undefined;

  const ticketData: TicketData = {
    nombre: nombre,
    cuenta: cuenta,
    fecha: formatearFecha(fechaRaw),
    monto: isNaN(montoRaw) ? 0 : montoRaw,
    folio: folio,
    hash: providedHash,
    idOficina: idOficina || undefined,
    rfc: rfcDisplay,
    hashValid: hashValid,
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <TicketCard {...ticketData} />
    </main>
  );
}

