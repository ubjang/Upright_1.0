import type { Metadata } from "next";
import { CheckInSection } from "@/components/check/CheckInSection";

export const metadata: Metadata = {
  title: "오늘의 체크 | 청렴 바이브",
  description: "청렴도 평가 관점의 가벼운 실천 체크",
};

export default function CheckPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-emerald-950">오늘의 체크</h1>
        <p className="mt-2 text-sm text-slate-600">
          서로 다른 청렴 영역에서 세 가지를 골라 보았어요. 체크만으로도 인식이
          높아져요.
        </p>
      </div>
      <CheckInSection />
    </div>
  );
}
