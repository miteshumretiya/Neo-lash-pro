import { site, siteUrl } from "./site";
import { formatPrice } from "./format";

export function whatsappUrl(message: string) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export type OrderLine = {
  name: string;
  options?: string[];
  quantity: number;
  unitPrice?: number;
  priceLabel?: string;
  path?: string;
};

/** Builds the pre-filled WhatsApp order message (no cart, no online payment). */
export function orderMessage(lines: OrderLine[]) {
  const body = lines.map((line) => {
    const opts = line.options?.filter(Boolean).join(", ");
    const price =
      line.unitPrice !== undefined ? formatPrice(line.unitPrice * line.quantity) : line.priceLabel;
    const link = line.path ? `\n   ${siteUrl}${line.path}` : "";
    return `• ${line.name}${opts ? ` (${opts})` : ""} × ${line.quantity}${price ? ` — ${price}` : ""}${link}`;
  });
  const priced = lines.every((l) => l.unitPrice !== undefined);
  const total = priced
    ? `\nEstimated total: ${formatPrice(lines.reduce((sum, l) => sum + (l.unitPrice ?? 0) * l.quantity, 0))}`
    : "";
  return `Hi Neo Lash! I'd like to order:\n${body.join("\n")}${total}\n\nCould you confirm availability and delivery? Thank you!`;
}

export function enquiryMessage(topic: string) {
  return `Hi Neo Lash! I'd like some information about ${topic}.`;
}
