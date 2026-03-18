import type { Review } from "@/types";

interface ReviewCardProps { review: Review; index?: number; }

export default function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  // Alternate tile styles for visual variety
  const isAccent  = index % 7 === 0;
  const isGold    = index % 7 === 3;
  const isDark    = !isAccent && !isGold;

  const bg      = isAccent ? "bg-coral-400"   : isGold ? "bg-amber-300" : "bg-zinc-900";
  const text    = isAccent ? "text-white"      : isGold ? "text-espresso-800" : "text-zinc-300";
  const subtext = isAccent ? "text-white/70"   : isGold ? "text-espresso-600" : "text-zinc-500";
  const starOn  = isAccent ? "text-white"      : isGold ? "text-espresso-700" : "text-amber-400";
  const starOff = isAccent ? "text-white/30"   : isGold ? "text-espresso-400/30" : "text-zinc-700";
  const border  = isDark   ? "border border-zinc-800/50" : "";

  return (
    <div className={`rounded-2xl ${bg} ${border} p-6 flex flex-col gap-4 h-full`}>
      {/* Stars */}
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(s=>(
          <svg key={s} className={`w-4 h-4 ${s<=review.rating ? starOn : starOff}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      {/* Quote */}
      <p className={`${text} text-sm leading-relaxed flex-1`}>&ldquo;{review.message}&rdquo;</p>
      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-current/10">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${isAccent ? "bg-white/20 text-white" : isGold ? "bg-espresso-800/20 text-espresso-800" : "bg-coral-400/20 text-coral-400"}`}>
          {review.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className={`font-bold text-sm leading-none mb-0.5 ${text}`}>{review.name}</p>
          {review.created_at && (
            <p className={`text-[10px] ${subtext}`}>
              {new Date(review.created_at).toLocaleDateString("en-US",{month:"short",year:"numeric"})}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
