import PasswordLogin from "@/components/auth/PasswordLogin";

export default function CheckinLoginPage() {
  return <PasswordLogin action="/api/checkin/login" redirectTo="/checkin" title="Check-in login" />;
}
