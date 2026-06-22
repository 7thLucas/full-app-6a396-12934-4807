import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest, signJwt, buildAuthCookie } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { Form, Link, useActionData, useNavigation } from "react-router";
import { AuthLayout } from "~/components/auth/AuthLayout";
import { useConfigurables } from "~/modules/configurables";
import { Shield } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/dashboard");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    const user = await AuthService.login({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    const token = signJwt({ sub: user.id, role: user.role, username: user.username, email: user.email });
    const redirectTo = user.role === "admin" ? "/admin" : "/dashboard";
    return redirect(redirectTo, { headers: { "Set-Cookie": buildAuthCookie(token, new URL(request.url).hostname) } });
  } catch (error: any) {
    return { error: error.message ?? "Invalid credentials" };
  }
}

function LoginForm() {
  const actionData = useActionData<{ error?: string }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { config, loading } = useConfigurables();
  const appName = loading ? "BizVault AI" : (config?.appName ?? "BizVault AI");

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Mobile Logo */}
      <div className="flex lg:hidden items-center gap-3 justify-center mb-2">
        <div className="w-9 h-9 rounded-xl neon-button flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold gradient-text">{appName}</h1>
      </div>

      <div className="text-center lg:text-left">
        <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
        <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
      </div>

      <Form method="post" className="space-y-4">
        {actionData?.error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {actionData.error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="text-xs text-muted-foreground mb-1 block">Email Address</label>
          <input
            id="email" name="email" type="email" required autoComplete="email"
            placeholder="you@example.com"
            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="text-xs text-muted-foreground">Password</label>
            <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
          </div>
          <input
            id="password" name="password" type="password" required autoComplete="current-password"
            placeholder="••••••••"
            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full neon-button py-3 rounded-xl text-sm font-semibold disabled:opacity-50 mt-2"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/auth/register" className="text-primary font-medium hover:underline">Create one</Link>
      </p>

      <div className="p-3 bg-muted/20 rounded-xl text-center text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-0.5">Admin Access</p>
        <p>Email: admin@bizvaultai.com | Password: 281109</p>
      </div>
    </div>
  );
}

export default function LoginRoute() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
