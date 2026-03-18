import Link from "next/link";
import { BgDots, BgMeshGrid, BgGlowBlob, BgWatermark, BgDiagonalLines } from "@/components/BgDecor";
export default function NotFound() {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-4">
      <div className="max-w-md w-full grid grid-cols-2 gap-3">
        <div className="col-span-2 bento-card relative overflow-hidden p-10 md:p-12 text-center min-h-[240px] flex flex-col items-center justify-center">
          <BgMeshGrid opacity={0.5}/><BgGlowBlob color="coral" position="center"/>
          <BgWatermark text="404" />
          <p className="relative z-10 font-display font-black leading-none text-faint" style={{fontSize:"6rem"}}>404</p>
          <h1 className="relative z-10 font-display text-2xl font-black text-page mt-2 mb-2">Page not found</h1>
          <p className="relative z-10 text-body text-sm font-light">That page doesn't exist or has been moved.</p>
        </div>
        <Link href="/" className="rounded-2xl bg-coral-400 relative overflow-hidden p-7 flex flex-col justify-between min-h-[140px] hover:opacity-90 transition-opacity">
          <BgDots dark opacity={0.5}/>
          <span className="relative z-10 text-white/70 text-xs font-semibold uppercase tracking-widest">Go back</span>
          <span className="relative z-10 text-white font-display font-black text-xl leading-tight">Home →</span>
        </Link>
        <Link href="/contact" className="bento-card relative overflow-hidden p-7 flex flex-col justify-between min-h-[140px] hover:shadow-lg transition-shadow">
          <BgDiagonalLines opacity={0.4}/>
          <span className="relative z-10 text-muted text-xs font-semibold uppercase tracking-widest">Or try</span>
          <span className="relative z-10 text-page font-display font-bold text-xl leading-tight hover:text-coral-500 transition-colors">Contact →</span>
        </Link>
      </div>
    </div>
  );
}
