"use client";

type UserRow = {
  userId: string;
  checkDays: number[];
  quizDays: number[];
  lastSubmitted: string;
};

type Props = {
  users: UserRow[];
  monthKey: string;
};

function maskUserId(id: string): string {
  if (id.length <= 8) return id;
  return id.slice(0, 4) + "…" + id.slice(-4);
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ done }: { done: boolean }) {
  return done ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      완료
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-600/30 px-2.5 py-0.5 text-xs font-medium text-slate-500">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
      미참여
    </span>
  );
}

function downloadCSV(users: UserRow[], monthKey: string) {
  const header = "사용자ID,체크(1일),체크(15일),퀴즈(1일),퀴즈(15일),최근제출일\n";
  const rows = users
    .map((u) => {
      const c1 = u.checkDays.includes(1) ? "O" : "X";
      const c15 = u.checkDays.includes(15) ? "O" : "X";
      const q1 = u.quizDays.includes(1) ? "O" : "X";
      const q15 = u.quizDays.includes(15) ? "O" : "X";
      const date = u.lastSubmitted ? new Date(u.lastSubmitted).toISOString() : "";
      return `${u.userId},${c1},${c15},${q1},${q15},${date}`;
    })
    .join("\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + header + rows], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `청렴바이브_참여현황_${monthKey}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ParticipationTable({ users, monthKey }: Props) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-700/50 bg-slate-800/40 py-16">
        <svg className="mb-4 h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
        <p className="text-sm text-slate-500">이번 달 참여 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          사용자별 참여 현황
          <span className="ml-2 text-sm font-normal text-slate-500">
            총 {users.length}명
          </span>
        </h3>
        <button
          type="button"
          onClick={() => downloadCSV(users, monthKey)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-500/50 hover:bg-slate-700 hover:text-emerald-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          CSV 다운로드
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-800/80">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  사용자 ID
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  체크 (1일)
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  체크 (15일)
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  퀴즈 (1일)
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  퀴즈 (15일)
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  최근 제출
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {users.map((u) => (
                <tr
                  key={u.userId}
                  className="transition-colors hover:bg-slate-700/20"
                >
                  <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-slate-300">
                    {maskUserId(u.userId)}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <StatusBadge done={u.checkDays.includes(1)} />
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <StatusBadge done={u.checkDays.includes(15)} />
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <StatusBadge done={u.quizDays.includes(1)} />
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <StatusBadge done={u.quizDays.includes(15)} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-xs text-slate-400">
                    {formatDate(u.lastSubmitted)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
