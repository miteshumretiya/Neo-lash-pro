import { orderMessage, whatsappUrl, type OrderLine } from "@/lib/whatsapp";
import { WhatsApp } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

type WhatsAppBuyProps = {
  lines: OrderLine[];
  label?: string;
  className?: string;
  size?: "sm" | "md";
  variant?: "solid" | "ghost";
};

/** Opens WhatsApp with a pre-filled order — the only way to buy (no cart). */
export function WhatsAppBuy({ lines, label = "Buy on WhatsApp", className, size = "md", variant = "solid" }: WhatsAppBuyProps) {
  return (
    <a
      href={whatsappUrl(orderMessage(lines))}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="Order"
      className={cn(
        "btn roll-host",
        size === "sm" && "btn-sm",
        variant === "solid" ? "bg-whatsapp text-white hover:bg-[#17703c]" : "btn-ghost",
        className,
      )}
    >
      <span className="inline-flex items-center gap-2">
        <WhatsApp size={size === "sm" ? 15 : 18} />
        {label}
      </span>
    </a>
  );
}
