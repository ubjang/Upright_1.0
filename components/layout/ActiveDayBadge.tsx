"use client";

import { useEffect, useState } from "react";
import { isActiveSubmissionDay } from "@/lib/dates/activeDays";

/** 클라이언트에서만 KST 제출일을 계산해 SSR/CSR 시각 차로 인한 하이드레이션 불일치를 피합니다. */
export function ActiveDayBadge() {
  const [active, setActive] = useState<boolean | null>(null);

  useEffect(() => {
    setActive(isActiveSubmissionDay());
  }, []);

  if (active === null) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
        제출일은 매월 1일·15일(한국 시간)이에요
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? "bg-sky-100 text-sky-800 ring-1 ring-sky-200"
          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
      }`}
    >
      {active
        ? "오늘은 체크·퀴즈 제출일이에요 (KST)"
        : "오늘은 제출일이 아니에요 · 참여는 매월 1일·15일"}
    </span>
  );
}
