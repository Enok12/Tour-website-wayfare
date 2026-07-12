// Generates human-shareable booking references like "TRK-2026-4F82".
// Format: TRK-<year>-<4 char base36 from timestamp+random>, uppercased.
// Collisions are astronomically unlikely, but the repository layer still
// retries once against the unique constraint as a safety net.

export function generateBookingReference(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  const timeFragment = Date.now().toString(36).slice(-3).toUpperCase();
  return `TRK-${year}-${timeFragment}${random}`.slice(0, 16);
}
