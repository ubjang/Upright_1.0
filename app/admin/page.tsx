import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "관리자 | 청렴 바이브",
  description: "청렴 바이브 참여 현황 관리 및 직원 관리",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
