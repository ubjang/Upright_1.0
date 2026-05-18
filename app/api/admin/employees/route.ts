import { type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/adminClient";

export const dynamic = "force-dynamic";

function checkPassword(request: NextRequest): boolean {
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw) return true;
  const authHeader = request.headers.get("authorization") ?? "";
  return authHeader === `Bearer ${adminPw}`;
}

/** 직원 목록 조회 */
export async function GET(request: NextRequest) {
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

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ employees: data ?? [] });
}

/** 직원 추가 */
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

  const body = await request.json();
  const { employee_id, name, department, position } = body;

  if (!employee_id || !name) {
    return Response.json(
      { error: "사번과 이름은 필수입니다." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("employees")
    .insert({ employee_id, name, department: department ?? "", position: position ?? "" })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return Response.json(
        { error: "이미 등록된 사번입니다." },
        { status: 409 },
      );
    }
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ employee: data }, { status: 201 });
}

/** 직원 수정 */
export async function PUT(request: NextRequest) {
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

  const body = await request.json();
  const { id, employee_id, name, department, position } = body;

  if (!id) {
    return Response.json({ error: "id는 필수입니다." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("employees")
    .update({ employee_id, name, department, position })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ employee: data });
}

/** 직원 삭제 */
export async function DELETE(request: NextRequest) {
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

  const { id } = await request.json();

  if (!id) {
    return Response.json({ error: "id는 필수입니다." }, { status: 400 });
  }

  const { error } = await supabase.from("employees").delete().eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
