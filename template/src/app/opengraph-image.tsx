import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "SITE — what it does";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori: every multi-child div needs display:flex, text goes in template strings, no CSS grid.
function D({ style, ...props }: React.ComponentProps<"div">) {
  return <div {...props} style={{ display: "flex", ...style }} />;
}

const ROWS: [string, number][] = [["first_metric", 98], ["second_metric", 91], ["third_metric", 100], ["fourth_metric", 64]];

export default function Image() {
  return new ImageResponse(
    (
      <D style={{ width: "100%", height: "100%", background: "#1e1e1e", color: "#fefefe", fontFamily: "ui-monospace, Menlo, monospace", padding: 56, justifyContent: "space-between" }}>
        <D style={{ flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <D style={{ alignItems: "center", gap: 14, fontSize: 26, letterSpacing: 2 }}>
            <D style={{ width: 18, height: 18, borderRadius: 9, background: "#fefefe" }} />
            SITE
          </D>
          <D style={{ flexDirection: "column", gap: 20 }}>
            <D style={{ fontSize: 22, color: "#9a9a9a", letterSpacing: 2 }}>{"WHAT IT IS // POWERED BY JEV"}</D>
            <D style={{ flexDirection: "column", fontSize: 92, lineHeight: 0.95, letterSpacing: -3, fontFamily: "ui-sans-serif, system-ui, sans-serif", fontWeight: 500 }}>
              <D>Short line.</D>
              <D>Shorter line.</D>
            </D>
            <D style={{ fontSize: 26, color: "#9a9a9a", fontFamily: "ui-sans-serif, system-ui, sans-serif", maxWidth: 600 }}>{"One sentence with the measured number."}</D>
          </D>
        </D>
        <D style={{ flexDirection: "column", width: 420, border: "1px solid #3a3a3a", padding: 22, gap: 14, alignSelf: "center" }}>
          {ROWS.map(([k, v]) => (
            <D key={k} style={{ flexDirection: "column", gap: 6 }}>
              <D style={{ justifyContent: "space-between", fontSize: 17 }}>
                <D style={{ color: "#9a9a9a" }}>{k}</D>
                <D style={{ color: "#3b6cff" }}>{`${v}%`}</D>
              </D>
              <D style={{ height: 3, background: "#333" }}>
                <D style={{ width: `${v}%`, height: 3, background: "#3b6cff" }} />
              </D>
            </D>
          ))}
        </D>
      </D>
    ),
    size,
  );
}
