import React, { useRef } from "react";

export default function CodeEditor({ value, onChange }) {
  const ref = useRef(null);

  return (
    <div className="bg-[#090b1f] border border-[var(--border,#1a214b)] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border,#1a214b)]">
        <div className="flex items-center gap-2 text-xs text-[var(--muted,#a9b0d0)]">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="ml-2">editor.js</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-xl bg-black/30 text-xs hover:bg-black/40">
            Run
          </button>
          <button className="px-3 py-1.5 rounded-xl bg-black/30 text-xs hover:bg-black/40">
            Debug
          </button>
        </div>
      </div>

      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="min-h-[360px] w-full bg-[#0b0e2b] p-4 outline-none resize-y font-mono text-sm text-[var(--text,#e6e6f2)]"
        placeholder={`// Write your solution here
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
}`}
      />
    </div>
  );
}
