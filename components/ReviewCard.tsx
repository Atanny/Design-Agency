import type { Review } from "@/types";

interface ReviewCardProps { review: Review; index?: number; }

export default function ReviewCard({ review, index=0 }: ReviewCardProps) {
  // Cycle through 4 variants: default, coral, amber, dark-espresso
  const variant = index % 4;
  const styles = [
    { wrap:"bento-card",           quote:"text-body",         name:"text-page",    sub:"text-muted",  star:"text-amber-400",    starOff:"text-faint",    divider:"border-card",  avatar:"bg-coral-400/10 text-coral-500" },
    { wrap:"tile-gradient-coral",         quote:"text-white/80",     name:"text-white",   sub:"text-white/60", star:"text-white",      starOff:"text-white/25", divider:"border-white/20", avatar:"bg-white/20 text-white" },
    { wrap:"bg-amber-300",         quote:"text-espresso-700", name:"text-espresso-800", sub:"text-espresso-600", star:"text-espresso-700", starOff:"text-espresso-400/30", divider:"border-espresso-400/20", avatar:"bg-espresso-800/15 text-espresso-800" },
    { wrap:"bg-espresso-800",      quote:"text-zinc-400",     name:"text-white",   sub:"text-zinc-500", star:"text-amber-400",  starOff:"text-zinc-700", divider:"border-zinc-700/60", avatar:"bg-coral-400/20 text-coral-400" },
  ];
  const s = styles[variant];

  return (
    <div className={`${s.wrap} rounded-2xl p-6 flex flex-col gap-4 h-full`}>
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(n=>(
          <svg key={n} className={`w-4 h-4 ${n<=review.rating?s.star:s.starOff}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      <p className={`${s.quote} text-sm leading-relaxed flex-1 font-light`}>&ldquo;{review.message}&rdquo;</p>
      <div className={`flex items-center gap-3 pt-3 border-t ${s.divider}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${s.avatar}`}>
          {review.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className={`font-semibold text-sm leading-none mb-0.5 ${s.name}`}>{review.name}</p>
          {review.created_at && (
            <p className={`text-[11px] ${s.sub}`}>
              {new Date(review.created_at).toLocaleDateString("en-US",{month:"short",year:"numeric"})}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
