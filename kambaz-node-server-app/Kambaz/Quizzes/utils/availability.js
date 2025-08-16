// kambaz-node-server-app/Kambaz/Quizzes/utils/availability.js

/**
 * 基于 quiz.window（due/availableFrom/availableUntil）计算状态
 * 返回：
 *   { status: "AVAILABLE" | "NOT_YET" | "CLOSED",
 *     label: string }    // 例如：Not available until 2025-08-20 10:00
 */
export function getAvailability(quiz, now = new Date()) {
  const win = quiz?.window || {};
  const from = win.availableFrom ? new Date(win.availableFrom) : null;
  const until = win.availableUntil ? new Date(win.availableUntil) : null;

  if (from && now < from) {
    return { status: "NOT_YET", label: `Not available until ${fmt(from)}` };
  }
  if (until && now > until) {
    return { status: "CLOSED", label: "Closed" };
  }
  return { status: "AVAILABLE", label: "Available" };
}

/**
 * 次数限制检查（multipleAttempts / maxAttempts）
 *   attemptsCount: 该学生已提交次数
 * 返回：{ allowed: boolean, nextAttemptNo: number }
 */
export function checkAttemptAllowance(quiz, attemptsCount) {
  const scoring = quiz?.scoring || {};
  const multiple = !!scoring.multipleAttempts;
  const max = Number(scoring.maxAttempts || 1);
  const used = Number(attemptsCount || 0);

  if (!multiple) {
    // 单次尝试
    return { allowed: used < 1, nextAttemptNo: used + 1 };
  }
  // 多次尝试
  return { allowed: used < max, nextAttemptNo: used + 1 };
}

// —— helpers ——
function fmt(d) {
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} `
       + `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
