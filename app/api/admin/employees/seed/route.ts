import { type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/adminClient";

export const dynamic = "force-dynamic";

function checkPassword(request: NextRequest): boolean {
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw) return true;
  const authHeader = request.headers.get("authorization") ?? "";
  return authHeader === `Bearer ${adminPw}`;
}

/** 27명 임시 직원 일괄 등록 */
export async function POST(request: NextRequest) {
  if (!checkPassword(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return Response.json(
      { error: "Supabase Service Role Key가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const departments = ["안전관리부", "검사1팀", "검사2팀", "기술지원팀", "경영지원팀"];
  const positions = ["팀원", "팀원", "팀원", "선임", "책임", "팀장"];

  const employees = Array.from({ length: 27 }, (_, i) => {
    const num = String(i + 1).padStart(3, "0");
    return {
      employee_id: `EMP${num}`,
      name: `직원${num}`,
      department: departments[i % departments.length],
      position: positions[i % positions.length],
    };
  });

  const { data, error } = await supabase
    .from("employees")
    .upsert(employees, { onConflict: "employee_id" })
    .select();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    message: `${data?.length ?? 0}명의 임시 직원이 등록되었습니다.`,
    employees: data,
  }, { status: 201 });
}
