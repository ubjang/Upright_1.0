import type { Metadata } from "next";
import { QuizSection } from "@/components/quiz/QuizSection";

export const metadata: Metadata = {
  title: "청렴 퀴즈 | 청렴 바이브",
  description: "사례형 청렴 OX·선택형 퀴즈",
};

export default function QuizPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-sky-950">청렴 퀴즈</h1>
        <p className="mt-2 text-sm text-slate-600">
          문제를 고르면 바로 해설이 나와요. 마지막에 한 번 제출하면 기록돼요.
        </p>
      </div>
      <QuizSection />
    </div>
  );
}
