const euro = new Intl.NumberFormat("en-MT", { style: "currency", currency: "EUR" });

export function formatPrice(value: number) {
  return euro.format(value);
}

export function discountPercent(regular: number, sale: number) {
  return Math.round((1 - sale / regular) * 100);
}

export function pad(n: number, size = 2) {
  return String(n).padStart(size, "0");
}

const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Formats an ISO date (YYYY-MM-DD) as e.g. "14 December 2022". */
export function formatDate(iso: string) {
  return longDate.format(new Date(`${iso}T00:00:00Z`));
}
