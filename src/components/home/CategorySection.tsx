import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { HOME_CATEGORIES } from "@/mocks/homeData";
import { useNavigate } from "react-router";

export default function CategorySection() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 260 : -260, behavior: "smooth" });
  }

  return (
    <section className="py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Explore Movies by Category</h2>
          <p className="text-muted-foreground mt-1 text-sm md:text-base max-w-xl">
            Find something for every mood, from action and adventure to comedy, drama, horror, and more.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll("left")} className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-muted/70 transition-colors">
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button onClick={() => scroll("right")} className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-muted/70 transition-colors">
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {HOME_CATEGORIES.map((cat, idx) => (
          <button
            key={cat.name}
            onClick={() => { setActive(idx); navigate(`/movies?genre=${encodeURIComponent(cat.name)}`); }}
            className={`group flex-shrink-0 rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer ${idx === active ? "border-primary ring-1 ring-primary/40" : "border-border hover:border-primary/50"}`}
            style={{ width: "clamp(200px, 22vw, 260px)" }}
          >
            <div className="grid grid-cols-2 gap-0.5 bg-muted/30">
              {cat.imgs.map((src, i) => (
                <img key={i} src={src} alt="" className="w-full aspect-square object-cover" />
              ))}
            </div>
            <div className="flex items-center justify-between p-3 bg-card">
              <span className="text-foreground font-semibold text-sm">{cat.name}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
            </div>
          </button>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-4">
        {HOME_CATEGORIES.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} className={`w-2 h-2 rounded-full transition-all duration-200 ${i === active ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground"}`} />
        ))}
      </div>
    </section>
  );
}
