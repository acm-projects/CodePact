
export default function CategoryCard({ cat, isActive, onToggle, styles }) {
    return (
      <div
        onClick={() => onToggle(cat.value)}
        className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer shadow-md hover:shadow-cyan-400/20 hover:border-cyan-400 hover:scale-[1.02] bg-gradient-to-br from-slate-900/60 to-slate-800/40 ${
          isActive
            ? "border-2 border-cyan-300 ring-2 ring-cyan-400/70 shadow-cyan-400/50 scale-[1.03]"
            : ""
        }`}
      >
        <span
          className={`${
            styles[cat.value]?.label || "text-cyan-300"
          } font-semibold block text-lg tracking-wide`}
        >
          {cat.label}
        </span>
        <span className="text-gray-400 text-sm leading-snug block mt-1">
          {cat.description}
        </span>
      </div>
    );
  }
  