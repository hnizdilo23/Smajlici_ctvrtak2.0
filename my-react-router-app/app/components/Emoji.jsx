export function Emoji({ emoji, label, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid aspect-square min-w-0 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-[clamp(1.875rem,6vw,3rem)] transition hover:-translate-y-1 hover:border-blue-600 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-600/15 focus:outline-none focus:ring-4 focus:ring-blue-600/20 active:translate-y-0"
    >
      {emoji}
    </button>
  );
}
