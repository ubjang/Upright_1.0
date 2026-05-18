import { type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/adminClient";

export const dynamic = "force-dynamic";

function checkPassword(request: NextRequest): boolean {
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw) return true; // 비밀번호 미설정 시 자유 접근
  const authHeader = request.headers.get("authorization") ?? "";
  return authHeader === `Bearer ${adminPw}`;
}

export async function GET(request: NextRequest) {
  if (!checkPassword(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return Response.json(
      { error: "Supabase Service Role Key가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const monthKey =
    request.nextUrl.searchParams.get("monthKey") ??
    new Date().toISOString().slice(0, 7);

  const [
    { data: checks, error: checkErr },
    { data: quizzes, error: quizErr },
    { count: totalEmployees, error: empErr },
  ] = await Promise.all([
    supabase
      .from("check_ins")
      .select("id, user_id, submitted_at, selected_phrases, submission_day")
      .eq("month_key", monthKey),
    supabase
      .from("quiz_attempts")
      .select("id, user_id, submitted_at, answers, submission_day")
      .eq("month_key", monthKey),
    supabase
      .from("employees")
      .select("*", { count: "exact", head: true }),
  ]);

  if (checkErr || quizErr || empErr) {
    return Response.json(
      { error: checkErr?.message ?? quizErr?.message ?? empErr?.message },
      { status: 500 },
    );
  }

  const safeChecks = checks ?? [];
  const safeQuizzes = quizzes ?? [];

  // 사용자별 집계
  const userMap = new Map<
    string,
    {
      userId: string;
      checkDays: number[];
      quizDays: number[];
      lastSubmitted: string;
    }
  >();

  for (const c of safeChecks) {
    const entry = userMap.get(c.user_id) ?? {
      userId: c.user_id,
      checkDays: [] as number[],
      quizDays: [] as number[],
      lastSubmitted: "",
    };
    entry.checkDays.push(c.submission_day);
    if (!entry.lastSubmitted || c.submitted_at > entry.lastSubmitted) {
      entry.lastSubmitted = c.submitted_at;
    }
    userMap.set(c.user_id, entry);
  }

  for (const q of safeQuizzes) {
    const entry = userMap.get(q.user_id) ?? {
      userId: q.user_id,
      checkDays: [] as number[],
      quizDays: [] as number[],
      lastSubmitted: "",
    };
    entry.quizDays.push(q.submission_day);
    if (!entry.lastSubmitted || q.submitted_at > entry.lastSubmitted) {
      entry.lastSubmitted = q.submitted_at;
    }
    userMap.set(q.user_id, entry);
  }

  const users = Array.from(userMap.values()).sort(
    (a, b) => b.lastSubmitted.localeCompare(a.lastSubmitted),
  );

  const uniqueCheckUsers = new Set(safeChecks.map((c) => c.user_id)).size;
  const uniqueQuizUsers = new Set(safeQuizzes.map((q) => q.user_id)).size;

  return Response.json({
    monthKey,
    summary: {
      totalChecks: safeChecks.length,
      totalQuizzes: safeQuizzes.length,
      uniqueCheckUsers,
      uniqueQuizUsers,
      totalUniqueUsers: userMap.size,
      totalEmployees: totalEmployees ?? 0,
    },
    users,
  });
}
