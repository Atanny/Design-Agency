import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-display text-8xl font-bold text-zinc-100 dark:text-zinc-800">
            404
          </p>
          <h1 className="font-display text-3xl font-bold text-espresso-800 dark:text-sand-50 mt-4 mb-3">
            Page not found
          </h1>
          <p className="text-espresso-500 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-espresso-800 text-sm font-bold hover:bg-coral-400 dark:hover:bg-coral-400 dark:hover:text-white transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </>
  );
}
