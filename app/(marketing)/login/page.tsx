import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/*
  Login screen for Phase 0. Accounts and real auth arrive in Phase 2,
  so this form is a static mock. No ads here, ever.
*/

export const metadata = {
  title: "Log in",
  description: "Access your dynamic QR codes and analytics.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 md:px-6">
      <Card>
        <h1 className="text-h2 font-semibold">Log in</h1>
        <p className="mt-2 text-body text-text-muted">
          For dynamic codes, analytics and your plan. Static codes never need
          an account.
        </p>
        <form className="mt-6 space-y-6" method="get" action="/login">
          <Input
            id="login-email"
            label="Email"
            type="email"
            autoComplete="email"
            required
          />
          <Input
            id="login-password"
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            helper="Six characters or more."
          />
          <Button type="submit" className="w-full">
            Log in
          </Button>
          <Button variant="secondary" className="w-full">
            Continue with Google
          </Button>
        </form>
        <p className="mt-6 text-small text-text-muted">
          No account yet?{" "}
          <Link href="/signup" className="font-medium text-primary underline">
            Sign up free
          </Link>
        </p>
      </Card>
    </div>
  );
}
