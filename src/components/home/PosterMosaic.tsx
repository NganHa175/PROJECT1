import { Play } from "lucide-react";
import { HERO_ROW_1, HERO_ROW_2, HERO_ROW_3, HERO_ROW_4 } from "@/mocks/homeData";

interface PosterMosaicProps {
  onPlayTrailer: () => void;
}

function PosterRow({ imgs, direction }: { imgs: string[]; direction: "left" | "right" }) {
  const tripled = [...imgs, ...imgs, ...imgs];
  const animClass = direction === "left" ? "animate-[scrollLeft_40s_linear_infinite]" : "animate-[scrollRight_40s_linear_infinite]";
  return (
    <div className="flex gap-2 overflow-hidden py-1">
      <div className={`flex gap-2 ${animClass} will-change-transform`}>
        {tripled.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="h-28 md:h-36 lg:h-44 w-auto rounded-xl object-cover flex-shrink-0 opacity-80"
          />
        ))}
      </div>
    </div>
  );
}

export default function PosterMosaic({ onPlayTrailer }: PosterMosaicProps) {
  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: "520px" }}>
      {/* Poster rows */}
      <div className="flex flex-col gap-2 py-4">
        <PosterRow imgs={HERO_ROW_1} direction="left" />
        <PosterRow imgs={HERO_ROW_2} direction="right" />
        <PosterRow imgs={HERO_ROW_3} direction="left" />
        <PosterRow imgs={HERO_ROW_4} direction="right" />
      </div>

      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

      {/* Central play button */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <button
          onClick={onPlayTrailer}
          aria-label="Watch Featured Trailer"
          className="group/play relative w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-primary hover:shadow-[0_0_40px_rgba(229,0,0,0.5)]"
        >
          <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover/play:opacity-100 transition-opacity duration-300 animate-ping" />
          <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1 relative z-10" />
        </button>
      </div>
    </div>
  );
}
