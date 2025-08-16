// kambaz-node-server-app/Kambaz/Quizzes/utils/autoScore.js

/**
 * 统一返回本题得分（number）
 * - MC: 选项下标严格相等
 * - TF: 布尔值严格相等
 * - FIB: 大小写不敏感、去首尾空格，支持多个正确答案
 */
export function scoreOne(question, response) {
  const pts = Number(question.points || 0);
  if (!pts) return 0;

  switch (question.type) {
    case "MC": {
      const correctIdx = question.correctIndex;
      const ansIdx = response?.answer?.mc;
      return Number(ansIdx) === Number(correctIdx) ? pts : 0;
    }
    case "TF": {
      const corr = !!question.correctBoolean;
      const ans = response?.answer?.tf;
      return ans === corr ? pts : 0;
    }
    case "FIB": {
      const corrList = (question.correctTexts || []).map(normalize);
      const ans = normalize(response?.answer?.fib);
      if (!ans || !corrList.length) return 0;
      return corrList.includes(ans) ? pts : 0;
    }
    default:
      return 0;
  }
}

export function scoreAll(questions, responses) {
  const byId = new Map(responses.map(r => [String(r.questionId), r]));
  let total = 0;
  const detailed = [];

  for (const q of questions) {
    const r = byId.get(String(q._id)) || null;
    const s = scoreOne(q, r);
    total += s;
    detailed.push({ questionId: q._id, autoScore: s });
  }
  return { totalAutoScore: total, detailed };
}

// —— helpers ——
function normalize(s) {
  if (typeof s !== "string") return "";
  return s.trim().toLowerCase();
}
