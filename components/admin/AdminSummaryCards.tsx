type SummaryData = {
  totalChecks: number;
  totalQuizzes: number;
  uniqueCheckUsers: number;
  uniqueQuizUsers: number;
  totalUniqueUsers: number;
  totalEmployees: number;
};

export function AdminSummaryCards({ summary }: { summary: SummaryData }) {
  const cards = [
    {
      label: "전체 참여자",
      value: summary.totalUniqueUsers,
      unit: "명",
      gradient: "from-violet-500 to-purple-600",
      shadow: "shadow-violet-500/25",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      ),
    },
    {
      label: "체크 제출",
      value: summary.totalChecks,
      unit: "건",
      sub: `${summary.uniqueCheckUsers}명 참여`,
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/25",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      label: "퀴즈 제출",
      value: summary.totalQuizzes,
      unit: "건",
      sub: `${summary.uniqueQuizUsers}명 참여`,
      gradient: "from-sky-500 to-blue-600",
      shadow: "shadow-sky-500/25",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg>
      ),
    },
    {
      label: "전체 제출",
      value: summary.totalChecks + summary.totalQuizzes,
      unit: "건",
      gradient: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/25",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
    },
    {
      label: "참여율",
      value: summary.totalEmployees > 0
        ? Math.round((summary.totalUniqueUsers / summary.totalEmployees) * 100)
        : 0,
      unit: "%",
      sub: `${summary.totalUniqueUsers}명 / ${summary.totalEmployees}명`,
      gradient: "from-rose-500 to-pink-600",
      shadow: "shadow-rose-500/25",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 backdrop-blur-sm transition-all duration-300 hover:border-slate-600/50 hover:bg-slate-800/80"
        >
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 blur-2xl transition-opacity group-hover:opacity-20" />
          <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${card.gradient} p-2.5 text-white shadow-lg ${card.shadow}`}>
            {card.icon}
          </div>
          <p className="text-sm font-medium text-slate-400">{card.label}</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {card.value}
            <span className="ml-1 text-base font-normal text-slate-500">{card.unit}</span>
          </p>
          {"sub" in card && card.sub && (
            <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
