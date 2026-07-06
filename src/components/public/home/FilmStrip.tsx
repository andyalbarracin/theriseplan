import Link from "next/link";

export interface FilmItem {
  title: string;
  img: string;
  isVideo: boolean;
  label: string;
  url: string;
}

const DEPARTURES: [string, string, string][] = [
  ["07:15 MADRID", "BRDG", "#e0a53a"],
  ["08:40 MIAMI", "ON TIME", "#7fae7f"],
  ["09:10 BOGOTÁ", "ON TIME", "#7fae7f"],
  ["10:35 SANTIAGO", "DELAYED", "#c98a3a"],
  ["11:25 LIMA", "ON TIME", "#7fae7f"],
  ["12:45 SÃO PAULO", "CANCEL", "#c0574a"],
];

/** Film strip where each frame links to a post; first cell is a departures
    board (port from Homepage.dc.html). */
export function FilmStrip({ films }: { films: FilmItem[] }) {
  return (
    <div style={{ position: "absolute", left: 150, top: 150, width: 772, height: 212, transform: "rotate(-1deg)", background: "#0b0b0a", boxShadow: "0 24px 44px -20px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 8, right: 8, top: 7, height: 11, background: "repeating-linear-gradient(90deg,#d6d3ca 0 11px,#0b0b0a 11px 23px)" }} />
      <div style={{ position: "absolute", left: 8, right: 8, bottom: 7, height: 11, background: "repeating-linear-gradient(90deg,#d6d3ca 0 11px,#0b0b0a 11px 23px)" }} />
      <div style={{ position: "absolute", left: 10, right: 10, top: 26, bottom: 26, display: "flex", gap: 7 }}>
        <div style={{ flex: 1.02, position: "relative", overflow: "hidden", background: "#080808", padding: "12px 10px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".08em", color: "#e0a53a" }}>DEPARTURES</div>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3, fontFamily: "var(--font-mono)", fontSize: 8, lineHeight: 1.1 }}>
            {DEPARTURES.map(([city, status, color]) => (
              <div key={city} style={{ display: "flex", justifyContent: "space-between", color: "#d8b46a" }}>
                <span>{city}</span>
                <span style={{ color }}>{status}</span>
              </div>
            ))}
          </div>
        </div>
        {films.map((f, i) => (
          <Link key={i} href={f.url} className="flmfrm" style={{ flex: 1, position: "relative", overflow: "hidden", background: "#101010", display: "block", textDecoration: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.img} alt={f.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0) 42%,rgba(6,7,6,.78))" }} />
            {f.isVideo && (
              <div style={{ position: "absolute", left: "50%", top: "44%", transform: "translate(-50%,-50%)", width: 34, height: 34, borderRadius: "50%", background: "rgba(13,13,14,.5)", border: "1px solid rgba(244,242,239,.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ marginLeft: 2, borderLeft: "9px solid #F4F2EF", borderTop: "6px solid transparent", borderBottom: "6px solid transparent" }} />
              </div>
            )}
            <span style={{ position: "absolute", left: 7, bottom: 7, right: 6, fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: ".14em", color: "rgba(244,242,239,.82)", lineHeight: 1.2 }}>{f.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
