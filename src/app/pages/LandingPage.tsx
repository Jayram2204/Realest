import { useEffect, useState } from "react";
import { Wallet, ShieldCheck, Cpu, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

interface Props {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: Props) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [scanning, setScanning] = useState(false);
  const [flicker, setFlicker] = useState<string[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      const next = Array.from({ length: 8 }, () => Math.floor(Math.random() * 2 ** 32).toString(16).padStart(8, "0"));
      setFlicker(next);
    }, 220);
    return () => clearInterval(id);
  }, []);

  const onMouse = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    setTilt({ x: (e.clientX / innerWidth - 0.5) * 30, y: (e.clientY / innerHeight - 0.5) * -20 });
  };

  const enter = () => {
    setScanning(true);
    setTimeout(() => onEnter(), 2000);
  };

  return (
    <div
      onMouseMove={onMouse}
      className="relative min-h-screen overflow-hidden bg-[#05060A] text-white"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <BackdropGrid />
      <FlickerColumn values={flicker} />

      <header className="relative z-10 flex items-center justify-between px-5 sm:px-8 pt-8 sm:pt-6 pb-4 sm:pb-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 border border-emerald-400/60 flex items-center justify-center rounded-[2px]">
            <div className="w-2 h-2 bg-emerald-400" />
          </div>
          <div>
            <div className="font-sans font-semibold text-[14px] tracking-tight">REALEST</div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-white/40">Verified Terminal · v0.4.1</div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-xl rounded-[2px] px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/70">Mainnet · Block #184,203</span>
        </div>
      </header>

      <div className="sm:hidden sticky top-0 z-20 mobile-header flex items-center justify-center gap-2 px-5 py-2.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-200/80">Mainnet · Block #184,203</span>
      </div>

      <main className="relative z-10 grid grid-cols-12 gap-8 px-5 sm:px-8 pt-10 pb-12 sm:py-16 max-w-[1400px] mx-auto">
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 border border-emerald-400/30 bg-emerald-400/5 backdrop-blur-xl rounded-[2px] px-3 py-1 mb-8">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">
              Hyperledger Fabric · Permissioned Ledger
            </span>
          </span>

          <h1 className="font-sans font-semibold text-[44px] sm:text-[68px] leading-[0.95] tracking-[-0.02em] mb-6">
            <span className="block">Real Estate,</span>
            <span className="block bg-gradient-to-r from-emerald-300 via-emerald-200 to-violet-300 bg-clip-text text-transparent">
              Decoupled.
            </span>
            <PulseRipple />
          </h1>

          <p className="font-sans text-[15px] sm:text-[17px] leading-relaxed text-white/60 max-w-[540px] mb-8 sm:mb-10">
            Experience the world's first Living Blockchain Observatory for institutional-grade
            property assets. Mint, verify, and fractionalize titled real estate against an
            auditable Fabric ledger.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3">
            <button
              onClick={enter}
              disabled={scanning}
              className={cn(
                "group relative inline-flex items-center justify-center gap-3 border border-emerald-400/40 bg-emerald-400/10 backdrop-blur-xl rounded-[2px]",
                "w-full sm:w-auto px-6 py-4 sm:py-3.5 font-sans text-[15px] sm:text-[14px] font-medium tracking-wide",
                "hover:bg-emerald-400/20 hover:border-emerald-300 transition-colors cta-pulse",
              )}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
              </span>
              <Wallet size={14} />
              {scanning ? "Establishing secure channel…" : "Connect Wallet"}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              <span className="absolute inset-0 rounded-[2px] border border-emerald-300/0 group-hover:border-emerald-300/60 group-hover:scale-110 transition-transform pointer-events-none" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 border border-white/10 bg-white/5 backdrop-blur-xl rounded-[2px] w-full sm:w-auto px-5 py-3.5 font-sans text-[13px] text-white/70 hover:bg-white/10">
              <Cpu size={13} /> View Architecture
            </button>
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6 sm:gap-6 mt-12 sm:mt-14 pt-8 border-t border-white/10">
            <KPI label="On-Chain TVL" value="$184.4M" sub="across 412 assets" />
            <KPI label="Mean Settlement" value="1.2s" sub="finality on Fabric" />
            <KPI label="Verified Sellers" value="38" sub="ABAC-attested" />
            <KPI label="Active Listings" value="216" sub="status = LISTED" />
          </dl>
        </div>

        <div className="col-span-12 lg:col-span-5 hidden md:flex items-center justify-center">
          <Monolith tilt={tilt} flicker={flicker} />
        </div>
      </main>

      <SectionDepthCards />
      <SectionGateway onEnter={enter} scanning={scanning} />

      <footer className="relative z-10 border-t border-white/10 px-8 py-6 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
          © 2026 Realest Labs · Permissioned by GovOrgMSP
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
          Hash · {flicker[0] ?? "00000000"}
        </span>
      </footer>

      {scanning && <ScanOverlay />}

      <style>{`
        .mobile-header {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          background: rgba(0, 0, 0, 0.6);
          border-bottom: 1px solid rgba(16, 185, 129, 0.12);
        }
        @keyframes ctaPulse {
          0%, 100% { border-color: rgba(52, 211, 153, 0.4); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
          50% { border-color: rgba(110, 231, 183, 0.9); box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15); }
        }
        .cta-pulse { animation: ctaPulse 2.4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function BackdropGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-[0.05] sm:opacity-40">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[140px]" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-500/15 blur-[140px]" />
    </div>
  );
}

function FlickerColumn({ values }: { values: string[] }) {
  return (
    <div className="pointer-events-none absolute right-6 top-32 hidden xl:flex flex-col gap-1 z-0 opacity-30">
      {values.map((v, i) => (
        <span key={i} className="font-mono text-[10px] tracking-widest text-emerald-300/60">
          0x{v}
        </span>
      ))}
    </div>
  );
}

function PulseRipple() {
  return (
    <span className="absolute -ml-2 mt-3 inline-flex">
      <span className="absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-90" />
      <span className="absolute inline-flex h-8 w-8 rounded-full border border-emerald-400/40 -m-3 animate-ping" />
    </span>
  );
}

function KPI({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-widest text-white/40">{label}</dt>
      <dd className="font-mono text-[24px] text-white mt-1">{value}</dd>
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">{sub}</span>
    </div>
  );
}

function Monolith({ tilt, flicker }: { tilt: { x: number; y: number }; flicker: string[] }) {
  return (
    <div className="relative w-[420px] h-[520px]" style={{ perspective: 1400 }}>
      <div
        className="absolute inset-0"
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 240ms ease-out",
        }}
      >
        {/* Base building shape */}
        <div className="absolute inset-x-12 inset-y-6 border border-emerald-400/30 bg-gradient-to-b from-emerald-400/10 via-violet-500/5 to-transparent backdrop-blur-2xl rounded-[2px]"
             style={{ transform: "translateZ(40px)" }}>
          <div className="absolute inset-2 grid grid-cols-6 grid-rows-12 gap-1">
            {Array.from({ length: 72 }).map((_, i) => (
              <div
                key={i}
                className="border border-white/5"
                style={{
                  background: i % 7 === 0 ? "rgba(16,185,129,0.6)" : i % 11 === 0 ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.04)",
                }}
              />
            ))}
          </div>
        </div>
        {/* Front face data */}
        <div
          className="absolute inset-x-4 top-2 border border-white/10 bg-white/5 backdrop-blur-xl rounded-[2px] p-3"
          style={{ transform: "translateZ(80px)" }}
        >
          <div className="font-mono text-[9px] uppercase tracking-widest text-emerald-300 mb-1">// LIVE BLOCK</div>
          <div className="font-mono text-[20px] text-white">#{(184203).toLocaleString()}</div>
          <div className="font-mono text-[10px] text-white/40">latency 12ms · peer0</div>
        </div>
        <div
          className="absolute right-4 bottom-4 border border-violet-400/30 bg-violet-500/10 backdrop-blur-xl rounded-[2px] p-3 w-[180px]"
          style={{ transform: "translateZ(70px)" }}
        >
          <div className="font-mono text-[9px] uppercase tracking-widest text-violet-300 mb-1">// MINT.PIPELINE</div>
          {flicker.slice(0, 3).map((v, i) => (
            <div key={i} className="font-mono text-[10px] text-white/70">0x{v.slice(0, 14)}…</div>
          ))}
        </div>
        {/* Floor */}
        <div
          className="absolute inset-x-12 bottom-0 h-[24px] border border-white/10 bg-gradient-to-r from-emerald-400/20 via-violet-400/20 to-emerald-400/20"
          style={{ transform: "rotateX(75deg) translateZ(0px)" }}
        />
      </div>
    </div>
  );
}

function SectionDepthCards() {
  const cards = [
    { id: "PROP-00418-BRK", title: "418 Sterling Place", apy: "6.42%", value: "$1.84M", img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900" },
    { id: "PROP-00612-QNS", title: "612 Astoria Blvd", apy: "5.80%", value: "$0.92M", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900" },
    { id: "PROP-00201-MAN", title: "201 W 110th, #4B", apy: "4.90%", value: "$3.10M", img: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=900" },
  ];
  return (
    <section className="relative z-10 px-8 py-20 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">// Tokenized Preview</div>
          <h2 className="font-sans font-semibold text-[34px] tracking-tight">Depth-card sampler.</h2>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">3 of 412 active</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((c) => (
          <article key={c.id} className="relative border border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2px] overflow-hidden group">
            <div className="aspect-[5/3] relative">
              <img src={c.img} alt={c.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute top-3 left-3 border border-emerald-400/40 bg-emerald-400/10 backdrop-blur rounded-[2px] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                ● Listed
              </div>
            </div>
            <div className="absolute inset-x-4 bottom-4 border border-white/10 bg-white/[0.06] backdrop-blur-xl rounded-[2px] p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-sans text-[14px] text-white">{c.title}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">{c.id}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[14px] text-emerald-300">{c.apy}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">{c.value}</div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SectionGateway({ onEnter, scanning }: { onEnter: () => void; scanning: boolean }) {
  return (
    <section className="relative z-10 px-8 py-24 max-w-[1100px] mx-auto text-center">
      <div className="relative inline-block mb-6">
        <span className="font-mono text-[10px] uppercase tracking-widest text-violet-300">// The Gateway</span>
      </div>
      <h2 className="font-sans font-semibold text-[44px] leading-tight tracking-tight max-w-[820px] mx-auto">
        Plug into the mainframe.
      </h2>
      <p className="font-sans text-[15px] text-white/60 max-w-[560px] mx-auto mt-4">
        Identity is verified via your MSP certificate. ABAC attributes determine which
        chaincode methods you can invoke.
      </p>
      <button
        onClick={onEnter}
        disabled={scanning}
        className="mt-10 group relative inline-flex items-center gap-3 border border-emerald-400/40 bg-emerald-400/10 backdrop-blur-xl rounded-[2px] px-8 py-4 font-sans text-[15px] font-medium tracking-wide hover:bg-emerald-400/20 hover:border-emerald-300"
      >
        <Wallet size={15} /> Enter Terminal
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
      </button>
    </section>
  );
}

function ScanOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-[480px] h-[280px] border border-emerald-400/40 bg-black/60 rounded-[2px] overflow-hidden">
        <div className="absolute inset-0 opacity-30"
             style={{ backgroundImage: "linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px)", backgroundSize: "8px 8px" }} />
        <div className="absolute left-0 right-0 h-[2px] bg-emerald-300 shadow-[0_0_20px_#10B981] animate-[scan_1.4s_ease-in-out_infinite]" style={{ top: "30%" }} />
        <div className="relative z-10 p-6 font-mono text-[11px] uppercase tracking-widest text-emerald-300 space-y-1">
          <div>▶ Establishing Fabric channel…</div>
          <div>▶ Validating MSP certificate…</div>
          <div>▶ Resolving ABAC attributes…</div>
          <div className="text-emerald-200">▶ Granting terminal access ✓</div>
        </div>
      </div>
      <style>{`@keyframes scan{0%,100%{top:5%}50%{top:90%}}`}</style>
    </div>
  );
}
