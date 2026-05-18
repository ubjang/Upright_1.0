import type { IntegrityAxisId } from "./integrityAxes";

export type QuizOx = {
  id: string;
  axisId: IntegrityAxisId;
  type: "ox";
  scenario: string;
  correct: "O" | "X";
  explanation: string;
};

export type QuizChoice = {
  id: string;
  axisId: IntegrityAxisId;
  type: "choice";
  scenario: string;
  choices: { key: string; label: string }[];
  correctKey: string;
  explanation: string;
};

export type QuizQuestion = QuizOx | QuizChoice;

export const QUIZ_BANK: QuizQuestion[] = [
  {
    id: "q_ox_1",
    axisId: "gifts",
    type: "ox",
    scenario:
      "민원인이 감사의 표시로 커피 쿠폰을 건넸어요. 업무와 직접 연관이 있다면 정중히 거절하는 편이 좋을까요?",
    correct: "O",
    explanation:
      "맞아요. 청렴도 평가와 행동강령에서는 직무 관련성이 있는 금품·편의는 특히 조심하라고 안내해요. 부담 없이 정중히 돌려주는 연습을 해두면 마음이 편해요.",
  },
  {
    id: "q_ox_2",
    axisId: "conflict",
    type: "ox",
    scenario:
      "친척이 입찰 참여 기업에 취업했고, 내가 그 심사 위원이에요. 아무도 모르면 그대로 참여해도 될까요?",
    correct: "X",
    explanation:
      "아니에요. 이해충돌이 의심되면 숨기지 말고 회피·보고 등 기관 절차를 따르는 것이 청렴 평가에서도 중요하게 봐요. 먼저 상의하면 해결 방법이 나와요.",
  },
  {
    id: "q_ox_3",
    axisId: "solicitation",
    type: "ox",
    scenario:
      "동료가 채용 서류 검토 때 특정 지원자만 살짝 봐 달라고 부탁했어요. 가벼운 부탁이라도 거절하는 게 맞을까요?",
    correct: "O",
    explanation:
      "맞아요. 청탁·알선은 형태와 관계없이 공정한 인사를 흐리게 해요. 정중히 거절하고 필요하면 상급자에게 공유하는 편이 안전해요.",
  },
  {
    id: "q_ox_4",
    axisId: "duty_ethics",
    type: "ox",
    scenario:
      "팀 물품 구매 시 지인 업체를 우선 선정해도 가격이 비슷하면 괜찮을까요?",
    correct: "X",
    explanation:
      "아니에요. 직무 관련 거래에서 사적 관계를 우선하면 직무윤리와 청렴 의무에 걸릴 수 있어요. 공개·경쟁 원칙을 지키는 게 평가에서도 긍정적으로 작용해요.",
  },
  {
    id: "q_mc_1",
    axisId: "fairness",
    type: "choice",
    scenario:
      "민원 서류 안내를 할 때, 가장 청렴·공정성 관점에서 바른 태도는 무엇일까요?",
    choices: [
      { key: "a", label: "익숙한 사람에게만 빠른 방법을 알려준다" },
      { key: "b", label: "모든 민원인에게 동일한 기준과 절차를 안내한다" },
      { key: "c", label: "복잡하면 대략만 말하고 넘어간다" },
    ],
    correctKey: "b",
    explanation:
      "정답은 b예요. 투명하고 차별 없는 안내는 청렴도 평가의 공정성·서비스 영역과도 연결돼요. 작은 친절이 신뢰를 쌓아요.",
  },
  {
    id: "q_mc_2",
    axisId: "conduct_secrecy",
    type: "choice",
    scenario:
      "업무 중 알게 된 개인정보를 동료와 카톡으로 공유해도 될까요?",
    choices: [
      { key: "a", label: "업무 목적·승인된 채널에서만 최소한으로 공유한다" },
      { key: "b", label: "신뢰하는 동료라면 괜찮다" },
      { key: "c", label: "가명 처리하면 항상 괜찮다" },
    ],
    correctKey: "a",
    explanation:
      "정답은 a예요. 행동강령과 개인정보 보호 관점에서 ‘필요 최소’와 ‘승인된 경로’가 핵심이에요. 습관적으로 나누지 않기로 해요.",
  },
  {
    id: "q_mc_3",
    axisId: "gifts",
    type: "choice",
    scenario:
      "공식 행사 후 기념품이 남았어요. 청렴 관점에서 가장 조심스러운 선택은?",
    choices: [
      { key: "a", label: "담당자 지시 없이 가져간다" },
      { key: "b", label: "기관 규정에 따라 처리·폐기한다" },
      { key: "c", label: "필요한 사람에게만 나눠준다" },
    ],
    correctKey: "b",
    explanation:
      "정답은 b예요. 금품·유사 이익은 규정과 기록에 맡기는 것이 청렴 평가에서도 안전해요.",
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

export function pickRandomQuizQuestions(count: number): QuizQuestion[] {
  return shuffle(QUIZ_BANK).slice(0, count);
}
