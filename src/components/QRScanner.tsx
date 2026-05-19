"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const router = useRouter();

  const startScanning = async () => {
    setIsScanning(true);
    const scanner = new Html5QrcodeScanner(
      "qr-scanner",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (result) => {
        const url = result;
        scanner.clear();
        setIsScanning(false);
        router.push(url);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {isScanning && (
        <div className="rounded-lg overflow-hidden">
          <div id="qr-scanner"></div>
        </div>
      )}

      {!isScanning ? (
        <button
          onClick={startScanning}
          className="w-full bg-[#af0039] hover:bg-[#8b0031] text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Escanear QR
        </button>
      ) : (
        <button
          onClick={stopScanning}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
        >
          Detener Escaneo
        </button>
      )}
    </div>
  );
}
