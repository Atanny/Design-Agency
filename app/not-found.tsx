import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full grid grid-cols-2 gap-3">
        <div className="col-span-2 rounded-2xl bg-zinc-900 p-10 text-center">
          <p className="font-display font-black leading-none text-zinc-800" style={{ fontSize: "7rem" }}>404</p>
          <h1 className="font-display text-2xl font-black text-white mt-2 mb-2">Page not found</h1>
          <p className="text-zinc-500 text-sm">That page doesn't exist or has been moved.</p>
        </div>
        <Link href="/" className="rounded-2xl bg-coral-400 p-6 flex flex-col justify-between hover:bg-coral-500 transition-colors">
          <span className="text-white/70 text-xs font-bold uppercase tracking-widest">Go back</span>
          <span className="text-white font-display font-black text-xl leading-tight">Home →</span>
        </Link>
        <Link href="/contact" className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors">
          <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Or try</span>
          <span className="text-zinc-300 font-bold hover:text-coral-400 transition-colors">Contact →</span>
        </Link>
      </div>
    </div>
  );
}
