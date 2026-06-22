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
    const user = await AuthService.register({
      username: String(formData.get("username") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    const token = signJwt({ sub: user.id, role: user.role, username: user.username, email: user.email });
    return redirect("/dashboard", { headers: { "Set-Cookie": buildAuthCookie(token, new URL(request.url).hostname) } });
  } catch (error: any) {
    return { error: error.message ?? "Registration failed" };
  }
}

function RegisterForm() {
  const actionData = useActionData<{ error?: string }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { config, loading } = useConfigurables();
  const appName = loading ? "BizVault AI" : (config?.appName ?? "BizVault AI");

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex lg:hidden items-center gap-3 justify-center mb-2">
        <div className="w-9 h-9 rounded-xl neon-button flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold gradient-text">{appName}</h1>
      </div>

      <div className="text-center lg:text-left">
        <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
        <p className="text-muted-foreground text-sm mt-1">Start managing your business smarter</p>
      </div>

      <Form method="post" className="space-y-4">
        {actionData?.error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {actionData.error}
          </div>
        )}

        <div>
          <label htmlFor="username" className="text-xs text-muted-foreground mb-1 block">Username</label>
          <input
            id="username" name="username" type="text" required
            placeholder="rahulsharma"
            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-xs text-muted-foreground mb-1 block">Email Address</label>
          <input
            id="email" name="email" type="email" required autoComplete="email"
            placeholder="you@example.com"
            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-xs text-muted-foreground mb-1 block">Password</label>
          <input
            id="password" name="password" type="password" required autoComplete="new-password"
            placeholder="Minimum 6 characters"
            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full neon-button py-3 rounded-xl text-sm font-semibold disabled:opacity-50 mt-2"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-primary font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

export default function RegisterRoute() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
