import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/*
  Signup screen for Phase 0. Accounts arrive in Phase 2, form is a mock.
  No ads here, ever.
*/

export const metadata = {
  title: "Sign up free",
  description: "Create a free account for dynamic QR codes and analytics.",
};

export default function SignupPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 md:px-6">
      <Card>
        <h1 className="text-h2 font-semibold">Sign up free</h1>
        <p className="mt-2 text-body text-text-muted">
          3 dynamic codes on the free plan, unlimited static codes always. No
          card needed.
        </p>
        <form className="mt-6 space-y-6" method="get" action="/signup">
          <Input
            id="signup-email"
            label="Email"
            type="email"
            autoComplete="email"
            required
          />
          <Input
            id="signup-password"
            label="Password"
            type="password"
            autoComplete="new-password"
            required
            helper="Use six characters or more."
          />
          <Button type="submit" className="w-full">
            Create account
          </Button>
          <Button variant="secondary" className="w-full">
            Continue with Google
          </Button>
        </form>
        <p className="mt-6 text-small text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
