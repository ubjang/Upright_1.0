type SaplingGrowthProps = {
  participationTotal: number;
};

const STAGES = [
  { min: 0, label: "씨앗", scale: 0.85, leaves: 0 },
  { min: 4, label: "새싹", scale: 0.95, leaves: 1 },
  { min: 8, label: "잎이 나요", scale: 1.05, leaves: 2 },
  { min: 12, label: "무럭무럭", scale: 1.15, leaves: 3 },
  { min: 16, label: "청렴 나무", scale: 1.25, leaves: 4 },
];

function stageFor(total: number) {
  let s = STAGES[0]!;
  for (const st of STAGES) {
    if (total >= st.min) s = st;
  }
  return s;
}

export function SaplingGrowth({ participationTotal }: SaplingGrowthProps) {
  const stage = stageFor(participationTotal);
  return (
    <div className="rounded-3xl bg-gradient-to-b from-emerald-50/90 to-sky-50/80 p-8 text-center shadow-inner ring-1 ring-emerald-100">
      <p className="text-sm font-medium text-emerald-900/80">
        누적 참여 {participationTotal}회 · {stage.label}
      </p>
      <div
        className="mx-auto mt-6 flex h-40 items-end justify-center transition-transform duration-700 ease-out"
        style={{ transform: `scale(${stage.scale})` }}
      >
        <svg
          viewBox="0 0 120 140"
          className="h-36 w-28 text-emerald-600 drop-shadow-sm"
          aria-hidden
        >
          <path
            d="M58 130 L62 130 L60 85 Z"
            fill="currentColor"
            className="text-amber-800/80"
          />
          <path
            d="M60 95 Q40 70 60 45 Q80 70 60 95"
            fill="currentColor"
            className="text-emerald-500"
          />
          {stage.leaves >= 2 && (
            <ellipse
              cx="42"
              cy="58"
              rx="14"
              ry="10"
              fill="currentColor"
              className="text-emerald-400"
            />
          )}
          {stage.leaves >= 3 && (
            <ellipse
              cx="78"
              cy="62"
              rx="14"
              ry="10"
              fill="currentColor"
              className="text-teal-400"
            />
          )}
          {stage.leaves >= 4 && (
            <ellipse
              cx="60"
              cy="38"
              rx="16"
              ry="12"
              fill="currentColor"
              className="text-emerald-300"
            />
          )}
        </svg>
      </div>
      <p className="mt-4 text-xs text-slate-600">
        체크와 퀴즈에 참여할수록 새싹이 자라나요. 평가도 중요하지만, 매일의 작은
        실천이 더 소중해요.
      </p>
    </div>
  );
}
