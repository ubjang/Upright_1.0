"use client";

import { useCallback, useEffect, useState } from "react";

type Employee = {
  id: string;
  employee_id: string;
  name: string;
  department: string;
  position: string;
  created_at: string;
};

type Props = {
  password: string;
};

export function EmployeeManager({ password }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    employee_id: "",
    name: "",
    department: "",
    position: "",
  });
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (password) headers["Authorization"] = `Bearer ${password}`;

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/employees", { headers });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "직원 목록을 불러올 수 없습니다.");
        return;
      }
      const data = await res.json();
      setEmployees(data.employees);
    } catch {
      setError("서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const resetForm = () => {
    setForm({ employee_id: "", name: "", department: "", position: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (emp: Employee) => {
    setForm({
      employee_id: emp.employee_id,
      name: emp.name,
      department: emp.department,
      position: emp.position,
    });
    setEditingId(emp.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const isEdit = Boolean(editingId);
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit ? { id: editingId, ...form } : form;

      const res = await fetch("/api/admin/employees", {
        method,
        headers,
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "저장에 실패했습니다.");
        setSaving(false);
        return;
      }

      resetForm();
      await fetchEmployees();
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 직원을 삭제하시겠습니까?`)) return;

    try {
      const res = await fetch("/api/admin/employees", {
        method: "DELETE",
        headers,
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "삭제에 실패했습니다.");
        return;
      }

      await fetchEmployees();
    } catch {
      setError("삭제 중 오류가 발생했습니다.");
    }
  };

  const downloadCSV = () => {
    const header = "사번,이름,부서,직위,등록일\n";
    const rows = employees
      .map((e) => {
        const date = new Date(e.created_at).toISOString().slice(0, 10);
        return `${e.employee_id},${e.name},${e.department},${e.position},${date}`;
      })
      .join("\n");

    const bom = "\uFEFF";
    const blob = new Blob([bom + header + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `청렴바이브_직원목록.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = searchQuery
    ? employees.filter(
        (e) =>
          e.name.includes(searchQuery) ||
          e.employee_id.includes(searchQuery) ||
          e.department.includes(searchQuery),
      )
    : employees;

  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    if (!confirm("27명의 임시 직원 데이터를 등록하시겠습니까?")) return;
    setSeeding(true);
    setError("");
    try {
      const res = await fetch("/api/admin/employees/seed", {
        method: "POST",
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "일괄 등록에 실패했습니다.");
      } else {
        await fetchEmployees();
      }
    } catch {
      setError("일괄 등록 중 오류가 발생했습니다.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">직원 관리</h2>
          <p className="mt-1 text-sm text-slate-400">
            등록된 직원 총 {employees.length}명
          </p>
        </div>
        <div className="flex gap-3">
          {employees.length === 0 && (
            <button
              type="button"
              onClick={handleSeed}
              disabled={seeding}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-600/50 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-amber-600/20 disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {seeding ? "등록 중…" : "27명 임시 등록"}
            </button>
          )}
          <button
            type="button"
            onClick={downloadCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-sky-500/50 hover:text-sky-400"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            CSV
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:shadow-emerald-500/30"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            직원 추가
          </button>
        </div>
      </div>

      {/* 검색 */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="이름, 사번, 부서 검색…"
          className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
          {error}
        </p>
      )}

      {/* 추가/수정 폼 */}
      {showForm && (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-base font-semibold text-white">
            {editingId ? "직원 정보 수정" : "새 직원 추가"}
          </h3>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">
                사번 *
              </label>
              <input
                type="text"
                value={form.employee_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, employee_id: e.target.value }))
                }
                required
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                placeholder="예: EMP001"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">
                이름 *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                placeholder="예: 홍길동"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">
                부서
              </label>
              <input
                type="text"
                value={form.department}
                onChange={(e) =>
                  setForm((f) => ({ ...f, department: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                placeholder="예: 경영지원팀"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">
                직위
              </label>
              <input
                type="text"
                value={form.position}
                onChange={(e) =>
                  setForm((f) => ({ ...f, position: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                placeholder="예: 대리"
              />
            </div>
            <div className="flex gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:opacity-50"
              >
                {saving ? "저장 중…" : editingId ? "수정" : "추가"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-600 bg-slate-700/50 px-6 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 직원 목록 테이블 */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-500" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-800/80">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    사번
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    이름
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    부서
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    직위
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    등록일
                  </th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">
                      {searchQuery
                        ? "검색 결과가 없습니다."
                        : "등록된 직원이 없습니다."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp) => (
                    <tr
                      key={emp.id}
                      className="transition-colors hover:bg-slate-700/20"
                    >
                      <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-slate-300">
                        {emp.employee_id}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 font-medium text-white">
                        {emp.name}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-slate-400">
                        {emp.department || "—"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-slate-400">
                        {emp.position || "—"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-xs text-slate-500">
                        {new Date(emp.created_at).toLocaleDateString("ko-KR")}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => startEdit(emp)}
                          className="mr-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-sky-400 transition hover:bg-sky-500/10"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(emp.id, emp.name)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
