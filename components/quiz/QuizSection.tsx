"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  pickRandomQuizQuestions,
  type QuizQuestion,
} from "@/lib/constants/quizBank";
import { getAxisLabel } from "@/lib/constants/integrityAxes";
import {
  getCurrentSubmissionDay,
  getMonthKey,
  isActiveSubmissionDay,
} from "@/lib/dates/activeDays";
import { createClient, hasSupabaseBrowserConfig } from "@/lib/supabase/client";

type AnswerState = Record<string, string>;

export function QuizSection() {
  const questions = useMemo(() => pickRandomQuizQuestions(2), []);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        .from("quiz_attempts")
        .select("id")
        .eq("month_key", monthKey)
        .eq("submission_day", submissionDay)
        .maybeSingle();
      if (!cancelled && data) {
        setAlreadyDone(true);
        setSubmitted(true);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [ensureSession, monthKey, submissionDay]);

  const pickAnswer = (qid: string, value: string) => {
    if (submitted || alreadyDone) return;
    setAnswers((a) => ({ ...a, [qid]: value }));
  };

  const allAnswered =
    questions.length > 0 && questions.every((q) => answers[q.id]);

  const saveAttempt = async () => {
    setMessage(null);
    if (!activeDay || !submissionDay) {
      setMessage("오늘은 제출일(1일·15일 KST)이 아니에요.");
      return;
    }
    if (alreadyDone) return;
    if (!allAnswered) {
      setMessage("문항을 모두 풀어 주세요.");
      return;
    }

    setSaving(true);
    try {
      const supabase = await ensureSession();
      if (!supabase) {
        setSaving(false);
        return;
      }
      const payload: Record<string, string> = {};
      questions.forEach((q) => {
        payload[q.id] = answers[q.id] ?? "";
      });

      const { error } = await supabase.from("quiz_attempts").insert({
        answers: payload,
        month_key: monthKey,
        submission_day: submissionDay,
      });

      if (error) {
        if (error.code === "23505") {
          setAlreadyDone(true);
          setSubmitted(true);
          setMessage("이미 오늘자 퀴즈를 제출하셨어요.");
        } else {
          setMessage(error.message);
        }
      } else {
        setSubmitted(true);
        setAlreadyDone(true);
        setMessage("제출했어요. 해설을 천천히 읽어 보세요.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!hasSupabaseBrowserConfig()) {
    return (
      <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-100">
        .env.local에 Supabase URL·Anon 키를 설정해 주세요.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed text-slate-600">
        사례는 <strong>청렴도 평가·행동강령</strong> 관점에서 골랐어요. 답을 고르면
        바로 해설이 나와요.
      </p>

      {loading ? (
        <p className="text-sm text-slate-500">불러오는 중…</p>
      ) : (
        questions.map((q) => (
          <QuizBlock
            key={q.id}
            question={q}
            value={answers[q.id] ?? ""}
            onPick={(v) => pickAnswer(q.id, v)}
            showResult={Boolean(answers[q.id])}
          />
        ))
      )}

      {message && (
        <p className="rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-900 ring-1 ring-sky-100">
          {message}
        </p>
      )}

      <button
        type="button"
        disabled={
          !activeDay ||
          alreadyDone ||
          saving ||
          loading ||
          !submissionDay ||
          !allAnswered ||
          submitted
        }
        onClick={saveAttempt}
        className="w-full rounded-2xl bg-sky-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {!activeDay
          ? "제출일에 다시 와 주세요"
          : submitted || alreadyDone
            ? "제출 완료"
            : saving
              ? "제출 중…"
              : "답안 제출하기"}
      </button>
    </div>
  );
}

function QuizBlock({
  question: q,
  value,
  onPick,
  showResult,
}: {
  question: QuizQuestion;
  value: string;
  onPick: (v: string) => void;
  showResult: boolean;
}) {
  const axis = getAxisLabel(q.axisId);
  const correct =
    q.type === "ox"
      ? q.correct
      : q.correctKey;
  const isCorrect = value === correct;

  return (
    <section className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-sky-100">
      <p className="text-xs font-medium text-sky-700">평가 축 · {axis}</p>
      <p className="mt-2 text-sm font-medium text-slate-800">{q.scenario}</p>

      {q.type === "ox" ? (
        <div className="mt-4 flex gap-3">
          {(["O", "X"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onPick(opt)}
              className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${
                value === opt
                  ? "bg-sky-600 text-white"
                  : "bg-sky-50 text-sky-900 hover:bg-sky-100"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {q.choices.map((c) => (
            <li key={c.key}>
              <button
                type="button"
                onClick={() => onPick(c.key)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm transition ${
                  value === c.key
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50/80 text-emerald-950 hover:bg-emerald-100"
                }`}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {showResult && value && (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm leading-relaxed ring-1 ${
            isCorrect
              ? "bg-emerald-50 text-emerald-900 ring-emerald-100"
              : "bg-amber-50 text-amber-950 ring-amber-100"
          }`}
        >
          <p className="font-medium">
            {isCorrect ? "잘하셨어요!" : "아쉽지만 괜찮아요."}{" "}
            <span className="text-slate-600">
              ({axis} 영역을 다시 떠올려 볼까요?)
            </span>
          </p>
          <p className="mt-2 text-slate-700">{q.explanation}</p>
        </div>
      )}
    </section>
  );
}
