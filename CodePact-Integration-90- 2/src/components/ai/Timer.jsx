import React, { useEffect, useState } from "react";

export default function Timer({ initialSeconds = 15 * 60, className = "" }) {
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    const id = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const tone =
    remaining <= 60
      ? "text-red-400"
      : remaining <= 300
      ? "text-yellow-300"
      : "text-sky-300";

  return (
    <span className={`font-semibold ${tone} ${className}`}>
      {mm}:{ss} Remaining
    </span>
  );
}
