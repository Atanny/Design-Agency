import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 rounded-2xl bg-zinc-900 p-10 text-center">
            <p className="font-display font-black text-[8rem] leading-none text-zinc-800">404</p>
            <h1 className="font-display text-3xl font-black text-white mt-2 mb-3">Page not found</h1>
            <p className="text-zinc-500 text-sm">The page you're looking for doesn't exist or has been moved.</p>
          </div>
          <div className="rounded-2xl bg-coral-400 p-6 flex flex-col justify-between">
            <span className="text-white/70 text-xs font-bold uppercase tracking-widest">Go back</span>
            <Link href="/" className="text-white font-display font-black text-xl leading-tight hover:text-white/80 transition-colors">
              Home →
            </Link>
          </div>
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between">
            <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Or try</span>
            <Link href="/contact" className="text-zinc-300 font-bold hover:text-coral-400 transition-colors">
              Contact us →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
