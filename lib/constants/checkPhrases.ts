import type { IntegrityAxisId } from "./integrityAxes";

export type CheckPhrase = {
  id: string;
  axisId: IntegrityAxisId;
  text: string;
};

/** 청렴도 평가 관점의 해요체 실천 문구 (축별 2개 이상 권장) */
export const CHECK_PHRASES: CheckPhrase[] = [
  {
    id: "d1",
    axisId: "duty_ethics",
    text: "직위를 이용해 사적인 이익을 얻지 않도록 스스로 점검해 봐요.",
  },
  {
    id: "d2",
    axisId: "duty_ethics",
    text: "업무는 공정하게 처리하고, 특정인에게 유리하지 않게 신경 써요.",
  },
  {
    id: "c1",
    axisId: "conflict",
    text: "직무와 겹치는 사적 이해관계가 있으면 미리 말씀드릴게요.",
  },
  {
    id: "c2",
    axisId: "conflict",
    text: "가족·지인과 관련된 업무는 회피하거나 보고 절차를 확인해요.",
  },
  {
    id: "g1",
    axisId: "gifts",
    text: "담당 업무와 관련된 선물·향응은 정중히 거절해요.",
  },
  {
    id: "g2",
    axisId: "gifts",
    text: "경조사비나 편의가 부담스럽다면 부드럽게 정리해요.",
  },
  {
    id: "s1",
    axisId: "solicitation",
    text: "인사·계약·심사와 관련된 청탁은 정중히 거절하고 기록해 둘게요.",
  },
  {
    id: "s2",
    axisId: "solicitation",
    text: "알선이나 뒷말이 들리면 공정한 절차를 지키도록 안내해요.",
  },
  {
    id: "f1",
    axisId: "fairness",
    text: "민원인을 차별 없이 동일한 기준으로 안내해요.",
  },
  {
    id: "f2",
    axisId: "fairness",
    text: "공개 가능한 정보는 투명하게, 기록은 꼼꼼히 남겨요.",
  },
  {
    id: "b1",
    axisId: "conduct_secrecy",
    text: "업무상 알게 된 개인정보는 필요한 범위에서만 다뤄요.",
  },
  {
    id: "b2",
    axisId: "conduct_secrecy",
    text: "내부 문서·회의 내용은 승인 없이 외부에 공유하지 않아요.",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 서로 다른 평가 축에서 최대 count개 선택 (축 수보다 적으면 가능한 만큼) */
export function pickCheckPhrasesDistinctAxes(count: number): CheckPhrase[] {
  const byAxis = new Map<IntegrityAxisId, CheckPhrase[]>();
  for (const p of CHECK_PHRASES) {
    const list = byAxis.get(p.axisId) ?? [];
    list.push(p);
    byAxis.set(p.axisId, list);
  }
  const axisOrder = shuffle([...byAxis.keys()]);
  const picked: CheckPhrase[] = [];
  for (const axisId of axisOrder) {
    if (picked.length >= count) break;
    const pool = byAxis.get(axisId);
    if (!pool?.length) continue;
    picked.push(pool[Math.floor(Math.random() * pool.length)]!);
  }
  return picked.slice(0, count);
}
