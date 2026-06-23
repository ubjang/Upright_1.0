import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "로그인 · 청렴 바이브",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl shadow-emerald-100/50 backdrop-blur-md">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-emerald-950">청렴 바이브</h1>
            <p className="mt-1 text-sm text-slate-500">로그인하거나 계정을 만드세요</p>
          </div>

          <LoginForm />
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          내부 직원 전용 서비스입니다
        </p>
      </div>
    </div>
  );
}
