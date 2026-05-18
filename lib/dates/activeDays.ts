const KST_TZ = "Asia/Seoul";

/** KST 기준 연-월-일 숫자 */
export function getKstYmd(date: Date = new Date()): {
  year: number;
  month: number;
  day: number;
} {
  const dtf = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = dtf.formatToParts(date);
  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  const d = Number(parts.find((p) => p.type === "day")?.value);
  return { year: y, month: m, day: d };
}

/** 예: 2026-03 */
export function getMonthKey(date: Date = new Date()): string {
  const { year, month } = getKstYmd(date);
  return `${year}-${String(month).padStart(2, "0")}`;
}

/** 오늘이 체크·퀴즈 제출 가능일(매월 1일·15일, KST)인지 */
export function isActiveSubmissionDay(date: Date = new Date()): boolean {
  const { day } = getKstYmd(date);
  return day === 1 || day === 15;
}

/** 제출 슬롯: 1일 또는 15일. 해당일이 아니면 null */
export function getCurrentSubmissionDay(
  date: Date = new Date(),
): 1 | 15 | null {
  const { day } = getKstYmd(date);
  if (day === 1 || day === 15) return day;
  return null;
}

/** 다음 활성일까지 남은 일 수(대략, 같은 달 기준 안내용) */
export function getNextActiveHint(date: Date = new Date()): string {
  const { year, month, day } = getKstYmd(date);
  if (day < 1) return "이번 달 1일";
  if (day < 15) return "이번 달 15일";
  if (day < 31) {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    return `${nextYear}년 ${nextMonth}월 1일`;
  }
  return "다음 달 1일";
}
