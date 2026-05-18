import { getNextActiveHint } from "@/lib/dates/activeDays";
import { getAxisLabel } from "@/lib/constants/integrityAxes";

type MonthlySummaryCardsProps = {
  monthKey: string;
  checkDoneThisMonth: boolean;
  quizDoneThisMonth: boolean;
  axisIdsThisMonth: string[];
};

export function MonthlySummaryCards({
  monthKey,
  checkDoneThisMonth,
  quizDoneThisMonth,
  axisIdsThisMonth,
}: MonthlySummaryCardsProps) {
  const nextHint = getNextActiveHint();
  const uniqueAxes = [...new Set(axisIdsThisMonth)];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-sky-100">
        <h3 className="text-sm font-semibold text-sky-900">이번 달 체크</h3>
        <p className="mt-2 text-2xl font-bold text-sky-700">
          {checkDoneThisMonth ? "참여했어요" : "아직이에요"}
        </p>
        <p className="mt-1 text-xs text-slate-500">기준 월: {monthKey}</p>
      </div>
      <div className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-emerald-100">
        <h3 className="text-sm font-semibold text-emerald-900">이번 달 퀴즈</h3>
        <p className="mt-2 text-2xl font-bold text-emerald-700">
          {quizDoneThisMonth ? "참여했어요" : "아직이에요"}
        </p>
        <p className="mt-1 text-xs text-slate-500">사례형 OX·선택형</p>
      </div>
      <div className="sm:col-span-2 rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">다음 제출일 안내</h3>
        <p className="mt-2 text-sm text-slate-600">
          매월 <strong>1일</strong>과 <strong>15일</strong>(한국 시간)에 체크·퀴즈를
          열어 두어요. 다음으로 열리는 날은 대략{" "}
          <strong>{nextHint}</strong> 쪽이에요.
        </p>
        {uniqueAxes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {uniqueAxes.map((id) => (
              <span
                key={id}
                className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs text-emerald-800 ring-1 ring-emerald-100"
              >
                {getAxisLabel(id)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
