import { MonthlySummaryCards } from "@/components/dashboard/MonthlySummaryCards";
import { SaplingGrowth } from "@/components/dashboard/SaplingGrowth";
import { getMonthKey } from "@/lib/dates/activeDays";
import { tryCreateClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const monthKey = getMonthKey();
  const supabase = await tryCreateClient();

  let participationTotal = 0;
  let checkDoneThisMonth = false;
  let quizDoneThisMonth = false;
  const axisIdsThisMonth: string[] = [];

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const [{ count: checkCount }, { count: quizCount }] = await Promise.all([
        supabase.from("check_ins").select("*", { count: "exact", head: true }),
        supabase.from("quiz_attempts").select("*", { count: "exact", head: true }),
      ]);

      participationTotal = (checkCount ?? 0) + (quizCount ?? 0);

      const { data: checks } = await supabase
        .from("check_ins")
        .select("selected_phrases")
        .eq("month_key", monthKey);

      if (checks?.length) {
        checkDoneThisMonth = true;
        for (const row of checks) {
          const arr = row.selected_phrases as { axisId?: string }[];
          if (Array.isArray(arr)) {
            for (const item of arr) {
              if (item?.axisId) axisIdsThisMonth.push(item.axisId);
            }
          }
        }
      }

      const { data: quizzes } = await supabase
        .from("quiz_attempts")
        .select("id")
        .eq("month_key", monthKey)
        .limit(1);

      quizDoneThisMonth = Boolean(quizzes?.length);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-emerald-950">
          안녕하세요, 청렴 바이브예요
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          공공기관 <strong>청렴도 평가</strong>는 우리 모두의 작은 실천이 모여
          만들어져요. 부담 없이 월 두 번, 오늘의 청렴 습관을 떠올려 보세요.
        </p>
      </div>

      {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
        <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-100">
          Supabase 환경 변수가 없어 참여 기록을 불러오지 못해요. .env.local을
          설정한 뒤 체크 페이지에서 한 번 들어가면 익명 로그인 후 숫자가 쌓여요.
        </p>
      )}

      <SaplingGrowth participationTotal={participationTotal} />

      <MonthlySummaryCards
        monthKey={monthKey}
        checkDoneThisMonth={checkDoneThisMonth}
        quizDoneThisMonth={quizDoneThisMonth}
        axisIdsThisMonth={axisIdsThisMonth}
      />
    </div>
  );
}
