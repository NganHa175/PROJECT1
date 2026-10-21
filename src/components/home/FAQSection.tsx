import { useState } from "react";
import { Plus, Minus, MessageSquare } from "lucide-react";
import { HOME_FAQS } from "@/mocks/homeData";

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const half = Math.ceil(HOME_FAQS.length / 2);
  const left = HOME_FAQS.slice(0, half);
  const right = HOME_FAQS.slice(half);

  function Item({ q, a, idx }: { q: string; a: string; idx: number }) {
    const isOpen = open === idx;
    return (
      <button
        onClick={() => setOpen(isOpen ? null : idx)}
        className="w-full text-left rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-all duration-200"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-xs font-mono font-bold w-5 flex-shrink-0">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span className="text-foreground font-semibold text-sm">{q}</span>
          </div>
          {isOpen ? <Minus className="w-4 h-4 text-primary flex-shrink-0" /> : <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
        </div>
        {isOpen && (
          <p className="mt-3 ml-8 text-muted-foreground text-sm leading-relaxed">{a}</p>
        )}
      </button>
    );
  }

  return (
    <section className="py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-1 text-sm">Have a question? We've got answers.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-red-700 transition-colors">
          <MessageSquare className="w-4 h-4" />
          Contact Support
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {left.map((item, i) => <Item key={i} {...item} idx={i} />)}
        </div>
        <div className="flex flex-col gap-3">
          {right.map((item, i) => <Item key={i} {...item} idx={i + half} />)}
        </div>
      </div>
    </section>
  );
}
