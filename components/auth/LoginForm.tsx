"use client";

import { useState } from "react";
import { createClient, hasSupabaseBrowserConfig } from "@/lib/supabase/client";

type Step = "input" | "sent";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!hasSupabaseBrowserConfig()) {
    return (
      <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-100">
        Supabase 환경 변수를 설정해 주세요.
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      if (authError) {
        setError(authError.message);
      } else {
        setStep("sent");
      }
    } finally {
      setLoading(false);
    }
  };

  if (step === "sent") {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-emerald-950">이메일을 확인해 주세요</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          <span className="font-medium text-emerald-700">{email}</span>으로<br />
          로그인 링크를 보냈어요. 링크를 클릭하면 바로 입장돼요.
        </p>
        <button
          type="button"
          onClick={() => { setStep("input"); setEmail(""); }}
          className="mt-6 text-xs text-slate-400 underline underline-offset-2 hover:text-slate-600"
        >
          다른 이메일로 다시 시도
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-600">
          이메일 주소
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@domain.com"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-300 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          autoFocus
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !email}
        className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:shadow-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "전송 중…" : "로그인 링크 받기"}
      </button>

      <p className="text-center text-xs text-slate-400">
        이메일로 일회용 로그인 링크를 보내 드려요. 비밀번호가 필요 없어요.
      </p>
    </form>
  );
}
