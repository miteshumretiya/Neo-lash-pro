import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Hover label that rolls each character up to a duplicate. Pure CSS: the
 * nearest `.roll-host` ancestor (link or button) triggers it.
 */
export function TextRoll({ text, className }: { text: string; className?: string }) {
  const chars = Array.from(text);
  const line = (key: string) => (
    <span key={key} className="roll-line">
      {chars.map((char, i) => (
        <span key={i} className="roll-char" style={{ "--i": i } as CSSProperties}>
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
  return (
    <span className={cn("roll", className)}>
      <span className="sr-only">{text}</span>
      <span className="roll-track" aria-hidden="true">
        {line("a")}
        {line("b")}
      </span>
    </span>
  );
}
