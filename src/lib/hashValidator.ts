import crypto from 'crypto';

export function calculateHash(
  nombre: string,
  idOficina: string,
  cuenta: string,
  fecha: string,
  folio: string,
  monto: string,
  rfc: string,
  secretKey: string
): string {
  const data = nombre + idOficina + cuenta + fecha + folio + monto + rfc + secretKey;
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function validateHash(
  nombre: string,
  idOficina: string,
  cuenta: string,
  fecha: string,
  folio: string,
  monto: string,
  rfc: string,
  providedHash: string,
  secretKey: string
): boolean {
  const calculatedHash = calculateHash(nombre, idOficina, cuenta, fecha, folio, monto, rfc, secretKey);

  // Debug logs
  const data = nombre + idOficina + cuenta + fecha + folio + monto + rfc + secretKey;
  console.log('[HASH DEBUG]');
  console.log('Data string:', data);
  console.log('Calculated hash:', calculatedHash);
  console.log('Provided hash:', providedHash);
  console.log('Match:', calculatedHash === providedHash);

  return calculatedHash === providedHash;
}
