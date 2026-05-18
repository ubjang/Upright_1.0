"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  pickCheckPhrasesDistinctAxes,
  type CheckPhrase,
} from "@/lib/constants/checkPhrases";
import {
  getCurrentSubmissionDay,
  getMonthKey,
  isActiveSubmissionDay,
} from "@/lib/dates/activeDays";
import { createClient, hasSupabaseBrowserConfig } from "@/lib/supabase/client";

export function CheckInSection() {
  const phrases = useMemo(() => pickCheckPhrasesDistinctAxes(3), []);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [alreadyDone, setAlreadyDone] = useState(false);

  const activeDay = isActiveSubmissionDay();
  const submissionDay = getCurrentSubmissionDay();
  const monthKey = getMonthKey();

  const ensureSession = useCallback(async () => {
    if (!hasSupabaseBrowserConfig()) {
      setMessage("Supabase 환경 변수를 설정해 주세요.");
      setLoading(false);
      return null;
    }
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) {
        setMessage(`로그인에 실패했어요: ${error.message}`);
        setLoading(false);
        return null;
      }
    }
    return supabase;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = await ensureSession();
      if (!supabase || cancelled) {
        if (!cancelled && !hasSupabaseBrowserConfig()) setLoading(false);
        return;
      }
      if (!submissionDay) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("check_ins")
        .select("id")
        .eq("month_key", monthKey)
        .eq("submission_day", submissionDay)
        .maybeSingle();
      if (!cancelled && data) setAlreadyDone(true);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [ensureSession, monthKey, submissionDay]);

  const toggle = (id: string) => {
    setChecked((c) => ({ ...c, [id]: !c[id] }));
  };

  const submit = async () => {
    setMessage(null);
    if (!activeDay || !submissionDay) {
      setMessage("오늘은 제출일(1일·15일 KST)이 아니에요.");
      return;
    }
    if (alreadyDone) return;

    const selected = phrases.filter((p) => checked[p.id]);
    if (selected.length === 0) {
      setMessage("실천해 볼 항목을 하나 이상 골라 주세요.");
      return;
    }

    setSaving(true);
    try {
      const supabase = await ensureSession();
      if (!supabase) {
        setSaving(false);
        return;
      }
      const selected_phrases = selected.map((p: CheckPhrase) => ({
        phraseId: p.id,
        axisId: p.axisId,
        text: p.text,
      }));

      const { error } = await supabase.from("check_ins").insert({
        selected_phrases,
        month_key: monthKey,
        submission_day: submissionDay,
      });

      if (error) {
        if (error.code === "23505") {
          setAlreadyDone(true);
          setMessage("이미 오늘자 체크를 제출하셨어요.");
        } else {
          setMessage(error.message);
        }
      } else {
        setAlreadyDone(true);
        setMessage("제출했어요. 오늘도 한 걸음 더해요!");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!hasSupabaseBrowserConfig()) {
    return (
      <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-100">
        프로젝트 루트에 .env.local 파일을 만들고 NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY를 넣어 주세요.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-slate-600">
        아래 문구는 <strong>청렴도 평가</strong>에서 중요하게 다루는 영역과
        연결돼 있어요. 부담 없이 오늘 마음에 드는 실천만 골라 보세요.
      </p>

      {loading ? (
        <p className="text-sm text-slate-500">불러오는 중…</p>
      ) : (
        <ul className="space-y-3">
          {phrases.map((p) => (
            <li key={p.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-emerald-100 transition hover:ring-emerald-200">
                <input
                  type="checkbox"
                  checked={Boolean(checked[p.id])}
                  onChange={() => toggle(p.id)}
                  className="mt-1 size-4 rounded border-slate-300 text-emerald-600"
                />
                <span className="text-sm text-slate-800">{p.text}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {message && (
        <p className="rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-900 ring-1 ring-sky-100">
          {message}
        </p>
      )}

      <button
        type="button"
        disabled={
          !activeDay || alreadyDone || saving || loading || !submissionDay
        }
        onClick={submit}
        className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {!activeDay
          ? "제출일(매월 1·15일)에 다시 와 주세요"
          : alreadyDone
            ? "이번 슬롯은 제출 완료"
            : saving
              ? "제출 중…"
              : "선택한 실천 제출하기"}
      </button>
    </div>
  );
}
