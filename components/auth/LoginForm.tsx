"use client";

import { useState } from "react";
import { createClient, hasSupabaseBrowserConfig } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

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

    if (mode === "signup") {
      if (password !== passwordConfirm) {
        setError("비밀번호가 일치하지 않아요.");
        return;
      }
      if (!employeeId.trim()) {
        setError("사번을 입력해 주세요.");
        return;
      }
    }

    setLoading(true);
    try {
      const supabase = createClient();

      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) {
          setError("이메일 또는 비밀번호가 올바르지 않아요.");
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { employee_id: employeeId.trim() } },
        });
        if (authError) {
          setError(authError.message);
        } else {
          setSignupDone(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
    setPassword("");
    setPasswordConfirm("");
    setEmployeeId("");
  };

  if (signupDone) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-emerald-950">가입 완료!</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          <span className="font-medium text-emerald-700">{email}</span>으로<br />
          확인 메일을 보냈어요. 메일 확인 후 로그인하세요.
        </p>
        <button
          type="button"
          onClick={() => { setSignupDone(false); switchMode("login"); }}
          className="mt-6 text-xs text-slate-400 underline underline-offset-2 hover:text-slate-600"
        >
          로그인으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 탭 */}
      <div className="flex rounded-xl bg-slate-100 p-1">
        {(["login", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              mode === m
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {m === "login" ? "로그인" : "회원가입"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-600">
            이메일
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

        {mode === "signup" && (
          <div>
            <label htmlFor="employeeId" className="mb-1.5 block text-xs font-medium text-slate-600">
              사번 <span className="text-red-400">*</span>
            </label>
            <input
              id="employeeId"
              type="text"
              required
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="회사 사번 입력"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-300 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
        )}

        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-slate-600">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6자 이상"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-300 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          />
        </div>

        {mode === "signup" && (
          <div>
            <label htmlFor="passwordConfirm" className="mb-1.5 block text-xs font-medium text-slate-600">
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호 재입력"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-300 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:shadow-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "처리 중…" : mode === "login" ? "로그인" : "계정 만들기"}
        </button>
      </form>
    </div>
  );
}
