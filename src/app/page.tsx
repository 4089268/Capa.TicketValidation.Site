import Image from "next/image";
import Link from "next/link";
import { QRScanner } from "@/components/QRScanner";

const DEMO_URL =
  "/ticket?n=Mi+Empresa+SA&c=0001&f=20250518&t=1500.00&i=TKT-2024-0042&h=abc123xyz&estado=pagado";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image src="/logo-capa.png" alt="Logo Capa" width={160} height={64} priority />
        </div>

        {/* Divider */}
        <div className="h-1 bg-linear-to-r from-[#af0039] to-[#b68401] rounded-full"></div>

        {/* Title and Description */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Validación de Comprobantes
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Escanea el código QR de tu comprobante de pago para verificar los detalles y autenticidad de tu transacción.
          </p>
        </div>

        {/* QR Scanner */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <QRScanner />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">o</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Demo Button */}
        <Link
          href={DEMO_URL}
          className="block w-full bg-[#af0039] hover:bg-[#8b0031] text-white py-3 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Ver Comprobante de Demostración
        </Link>

        {/* Footer Text */}
        <p className="text-xs text-gray-500 pt-2">
          Transacción segura y verificada
        </p>
      </div>
    </main>
  );
}

