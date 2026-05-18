import { SaplingGrowth } from "@/components/dashboard/SaplingGrowth";

export default function DemoPage() {
  const stages = [0, 4, 8, 12, 16];
  return (
    <div className="space-y-6 py-4">
      <h1 className="text-xl font-bold text-emerald-950">🌱 씨앗 성장 단계 미리보기</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stages.map((count) => (
          <div key={count}>
            <SaplingGrowth participationTotal={count} />
          </div>
        ))}
      </div>
    </div>
  );
}
