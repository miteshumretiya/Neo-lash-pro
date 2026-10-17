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
