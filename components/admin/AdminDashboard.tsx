"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminLogin } from "./AdminLogin";
import { AdminSummaryCards } from "./AdminSummaryCards";
import { ParticipationTable } from "./ParticipationTable";
import { EmployeeManager } from "./EmployeeManager";

type SummaryData = {
  totalChecks: number;
  totalQuizzes: number;
  uniqueCheckUsers: number;
  uniqueQuizUsers: number;
  totalUniqueUsers: number;
  totalEmployees: number;
};

type UserRow = {
  userId: string;
  checkDays: number[];
  quizDays: number[];
  lastSubmitted: string;
};

type StatsResponse = {
  monthKey: string;
  summary: SummaryData;
  users: UserRow[];
  error?: string;
};

type Tab = "dashboard" | "employees";

function generateMonthOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
    options.push({ value, label });
  }
  return options;
}

export function AdminDashboard() {
  const [password, setPassword] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");

  // Dashboard state
  const [monthKey, setMonthKey] = useState(
    () => new Date().toISOString().slice(0, 7),
  );
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const monthOptions = generateMonthOptions();

  // 비밀번호 필요 여부 확인
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `/api/admin/stats?monthKey=${new Date().toISOString().slice(0, 7)}`,
        );
        if (res.status === 401) {
          setNeedsAuth(true);
        } else {
          setNeedsAuth(false);
          setPassword("");
        }
      } catch {
        setNeedsAuth(false);
        setPassword("");
      }
    })();
  }, []);

  const fetchStats = useCallback(async () => {
    if (password === null) return;
    setLoading(true);
    setError("");

    try {
      const headers: HeadersInit = {};
      if (password) headers["Authorization"] = `Bearer ${password}`;

      const res = await fetch(`/api/admin/stats?monthKey=${monthKey}`, {
        headers,
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "데이터를 불러올 수 없습니다.");
        setData(null);
      } else {
        setData(json);
      }
    } catch {
      setError("서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, [monthKey, password]);

  useEffect(() => {
    if (password !== null && tab === "dashboard") {
      fetchStats();
    }
  }, [fetchStats, password, tab]);

  // 로딩 중 (비밀번호 필요 여부 확인 중)
  if (needsAuth === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-500" />
      </div>
    );
  }

  // 비밀번호 입력 필요
  if (needsAuth && password === null) {
    return <AdminLogin onAuthenticated={(pw) => setPassword(pw)} />;
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">관리자 대시보드</h1>
          <p className="mt-1 text-sm text-slate-400">
            청렴 바이브 참여 현황 및 직원 관리
          </p>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 rounded-xl border border-slate-700/50 bg-slate-800/40 p-1">
        <button
          type="button"
          onClick={() => setTab("dashboard")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            tab === "dashboard"
              ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 shadow-sm"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
            참여 현황
          </span>
        </button>
        <button
          type="button"
          onClick={() => setTab("employees")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            tab === "employees"
              ? "bg-gradient-to-r from-sky-500/20 to-blue-500/20 text-sky-400 shadow-sm"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            직원 관리
          </span>
        </button>
      </div>

      {/* 대시보드 탭 */}
      {tab === "dashboard" && (
        <div className="space-y-8">
          {/* 월 선택 */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-slate-400">
              조회 월
            </label>
            <select
              value={monthKey}
              onChange={(e) => setMonthKey(e.target.value)}
              className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={fetchStats}
              disabled={loading}
              className="rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2 text-sm text-slate-300 transition hover:border-emerald-500/50 hover:text-emerald-400 disabled:opacity-50"
            >
              {loading ? "조회 중…" : "새로고침"}
            </button>
          </div>

          {/* 에러 */}
          {error && (
            <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
              {error}
            </p>
          )}

          {/* 로딩 */}
          {loading && (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-500" />
            </div>
          )}

          {/* 데이터 */}
          {!loading && data && (
            <>
              <AdminSummaryCards summary={data.summary} />
              <ParticipationTable
                users={data.users}
                monthKey={data.monthKey}
              />
            </>
          )}
        </div>
      )}

      {/* 직원 관리 탭 */}
      {tab === "employees" && (
        <EmployeeManager password={password ?? ""} />
      )}
    </div>
  );
}
