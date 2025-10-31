export function scoreActivity(a) {
  const now = new Date().toISOString();
  const base = { activityId: a.id, userId: a.userId, createdAt: now };
  const out = [];

  if (a.kind === "application") {
    out.push({ ...base, points: 5, reason: "application_submitted" });
  }

  if (a.kind === "problem") {
    const map = { Easy: 2, Medium: 4, Hard: 6 };
    out.push({
      ...base,
      points: map[a.difficulty] || 2,
      reason: `problem_${a.difficulty.toLowerCase()}`,
    });
  }

  if (a.kind === "interview") {
    if (a.outcome === "scheduled")
      out.push({ ...base, points: 5, reason: "interview_scheduled" });
    if (a.outcome === "completed")
      out.push({ ...base, points: 15, reason: "interview_completed" });
    if (a.stage === "final" && a.outcome === "completed")
      out.push({ ...base, points: 10, reason: "interview_final_bonus" });
    if (a.outcome === "offer")
      out.push({ ...base, points: 50, reason: "offer" });
  }

  return out;
}
