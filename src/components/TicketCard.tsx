"use client";

import { useState } from "react";
import Image from "next/image";

export interface TicketData {
  nombre: string;
  cuenta: string;
  fecha: string;
  monto: number;
  folio: string;
  hash: string;
  idOficina?: string;
  rfc?: string;
  hashValid?: boolean;
}

function formatMonto(monto: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(monto);
}

function formatFecha(fecha: string) {
  try {
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  } catch {
    return fecha;
  }
}

function CutLine() {
  return (
    <div className="flex items-center gap-2 px-1 my-1">
      <div className="flex-1 border-t-2 border-dashed border-gray-300" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-gray-400 shrink-0"
      >
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>
      <div className="flex-1 border-t-2 border-dashed border-gray-300" />
    </div>
  );
}

function Divider() {
  return <div className="border-t border-gray-200 my-4" />;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 text-sm">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-800 font-medium text-right">{value}</span>
    </div>
  );
}

export function TicketCard({
  nombre,
  cuenta,
  fecha,
  monto,
  folio,
  hash,
  idOficina,
  rfc,
  hashValid,
}: TicketData) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGenerarFactura = () => {
    setIsRedirecting(true);

    // Construir URL
    const host = process.env.NEXT_PUBLIC_FACTURA_HOST || "https://arquoscrm.sytes.net:5002/capa/facturar";
    const url = rfc ? `${host}/${idOficina}/${folio}/${rfc}` : `${host}/${idOficina}/${folio}`;

    // Redirigir después de 2 segundos
    setTimeout(() => {
      window.location.href = url;
    }, 2000);
  };

  return (
    <div className="ticket-card w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Top cut line */}
      <div className="px-6 pt-6 pb-2">
        <CutLine />
      </div>

      {/* Header */}
      <div className="px-6 py-4 text-center">
        <div className="flex justify-center mb-2">
          <Image src="/logo-capa.png" alt="Logo Capa" width={200} height={80} />
        </div>
        <p className="text-sm text-gray-500 mt-1">Comprobante de Pago</p>
      </div>

      <div className="px-6">
        <Divider />

        {/* Data rows */}
        <div className="space-y-3">
          <Row label="Folio" value={folio} />
          {idOficina && <Row label="Oficina" value={idOficina} />}
          <Row label="Cuenta" value={cuenta} />
          <Row label="Fecha" value={formatFecha(fecha)} />
          <Row label="Cliente" value={nombre} />
          {rfc && <Row label="RFC" value={rfc} />}
        </div>

        <Divider />

        {/* Total */}
        <div className="flex justify-between items-center py-1">
          <span className="text-base font-semibold text-gray-700">TOTAL</span>
          <span className="text-2xl font-bold text-gray-900">
            {formatMonto(monto)}
          </span>
        </div>

        <Divider />

        {/* Generar Factura Button o Alerta de Inválido */}
        {hashValid === false ? (
          <div className="flex justify-center py-2">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
              ⚠️ <strong>Ticket Inválido</strong>
              <p className="mt-2 text-xs">La firma digital no coincide. Este comprobante no es auténtico.</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <button
              onClick={() => handleGenerarFactura()}
              className="inline-flex items-center px-6 py-2 rounded-lg bg-[#af0039] text-white font-semibold text-sm hover:bg-[#8b0031] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Generar Factura en Línea
            </button>
          </div>
        )}

        <Divider />

        {/* Hash */}
        <div className="text-center py-2">
          <p className="text-xs text-gray-400 mb-1">Firma digital</p>
          <p className="text-xs text-gray-600 font-mono break-all">{hash}</p>
        </div>

        <Divider />

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pb-2">
          Este comprobante fue generado digitalmente.
          <br />
          Consérvalo como comprobante de pago.
        </p>
      </div>

      {/* Bottom cut line */}
      <div className="px-6 pb-6 pt-2">
        <CutLine />
      </div>

      {/* Modal - Redirección a Facturación */}
      {isRedirecting && (
        <div className="modal-overlay fixed inset-0 bg-black/75 bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Generar Factura</h2>
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="animate-spin">
                <svg className="w-12 h-12 text-[#af0039]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2"></circle>
                  <path d="M12 2A10 10 0 0 1 22 12" strokeLinecap="round" strokeWidth="2"></path>
                </svg>
              </div>
              <p className="text-gray-600 text-center font-semibold">
                Redireccionando a facturación...
              </p>
              <p className="text-sm text-gray-500 text-center">
                Serás redireccionado en unos momentos
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
