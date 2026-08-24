import PasswordLogin from "@/components/auth/PasswordLogin";

export default function AdminLoginPage() {
  return <PasswordLogin action="/api/admin/login" redirectTo="/admin" title="Admin login" />;
}
