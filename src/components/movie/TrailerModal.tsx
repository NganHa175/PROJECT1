import { Modal } from "@/components/ui/Modal";

interface TrailerModalProps {
  open: boolean;
  onClose: () => void;
  youtubeId?: string;
  title?: string;
}

export default function TrailerModal({ open, onClose, youtubeId, title }: TrailerModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="xl" className="p-0 overflow-hidden">
      <div className="relative pt-[56.25%] bg-black rounded-2xl overflow-hidden">
        {youtubeId ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={open ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0` : ""}
            title={title ?? "Trailer"}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">No trailer available for this title</p>
          </div>
        )}
      </div>
      {title && <p className="text-foreground font-semibold text-center py-3 px-6">{title}</p>}
    </Modal>
  );
}
