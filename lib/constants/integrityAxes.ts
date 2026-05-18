/**
 * 공공기관 청렴도 평가에서 자주 다루는 영역(초안 축).
 * 기관 실제 지표표에 맞춰 id/label을 교체하면 됩니다.
 */
export const INTEGRITY_AXES = [
  {
    id: "duty_ethics",
    label: "청렴 의무·직무윤리",
    shortLabel: "직무윤리",
  },
  {
    id: "conflict",
    label: "이해충돌 방지",
    shortLabel: "이해충돌",
  },
  {
    id: "gifts",
    label: "금품·향응·편의",
    shortLabel: "금품·향응",
  },
  {
    id: "solicitation",
    label: "청탁·알선 금지",
    shortLabel: "청탁·알선",
  },
  {
    id: "fairness",
    label: "공정성·투명성",
    shortLabel: "공정·투명",
  },
  {
    id: "conduct_secrecy",
    label: "행동강령·비밀 유지",
    shortLabel: "행동강령",
  },
] as const;

export type IntegrityAxisId = (typeof INTEGRITY_AXES)[number]["id"];

export function getAxisLabel(id: string): string {
  const axis = INTEGRITY_AXES.find((a) => a.id === id);
  return axis?.label ?? id;
}
