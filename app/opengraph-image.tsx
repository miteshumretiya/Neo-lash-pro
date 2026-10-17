import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Neo Lash® Pro — lash & brow experts in St. Julian's, Malta";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Cached so the card is rendered once at build time instead of per request.
async function loadAssets() {
  "use cache";
  const [serif, serifItalic, sans, photo] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/InstrumentSerif-Regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/InstrumentSerif-Italic.ttf")),
    readFile(join(process.cwd(), "assets/fonts/InterTight-Regular.ttf")),
    readFile(join(process.cwd(), "public/media/site/202211-02.jpg")),
  ]);
  return {
    serif: new Uint8Array(serif),
    serifItalic: new Uint8Array(serifItalic),
    sans: new Uint8Array(sans),
    photo: `data:image/jpeg;base64,${photo.toString("base64")}`,
  };
}

/** Social card: the studio photo beside the wordmark, set in the site's typefaces. */
export default async function OpengraphImage() {
  const { serif, serifItalic, sans, photo } = await loadAssets();

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#f5f1eb", color: "#141414", fontFamily: "Inter Tight" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 660, padding: "60px 64px" }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: "#4f6261" }}>
            St. Julian&apos;s · Malta
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Instrument Serif", fontSize: 132, lineHeight: 0.9, letterSpacing: -3 }}>Neo Lash®</div>
            <div style={{ display: "flex", fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 46, marginTop: 26, color: "#4f6261" }}>
              Give your eyes the look they deserve.
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 22 }}>
            {["Salon", "Pro products", "Academy"].map((label) => (
              <div key={label} style={{ display: "flex", border: "1.5px solid rgba(20,20,20,0.25)", borderRadius: 999, padding: "10px 22px" }}>
                {label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, padding: "28px 28px 28px 0" }}>
          <img
            src={photo}
            alt=""
            width={512}
            height={574}
            style={{ objectFit: "cover", borderRadius: "256px 256px 28px 28px", width: "100%", height: "100%" }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: serif.buffer, style: "normal", weight: 400 },
        { name: "Instrument Serif", data: serifItalic.buffer, style: "italic", weight: 400 },
        { name: "Inter Tight", data: sans.buffer, style: "normal", weight: 400 },
      ],
    },
  );
}
