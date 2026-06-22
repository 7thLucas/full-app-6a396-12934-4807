import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { Form, Link, useActionData, useNavigation } from "react-router";
import { AuthLayout } from "~/components/auth/AuthLayout";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/dashboard");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try { await AuthService.forgotPassword(String(formData.get("email") ?? "")); } catch {}
  return { success: true, message: "If that email exists, a reset link has been sent. Check your inbox." };
}

function ForgotPasswordForm() {
  const actionData = useActionData<{ success?: boolean; message?: string }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Reset password</h2>
        <p className="text-muted-foreground text-sm mt-1">Enter your email to receive a reset link</p>
      </div>

      {actionData?.success ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">
          {actionData.message}
        </div>
      ) : (
        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="email" className="text-xs text-muted-foreground mb-1 block">Email Address</label>
            <input id="email" name="email" type="email" required placeholder="you@example.com"
              className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full neon-button py-3 rounded-xl text-sm font-semibold disabled:opacity-50">
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </Form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        <Link to="/auth/login" className="text-primary font-medium hover:underline">← Back to sign in</Link>
      </p>
    </div>
  );
}

export default function ForgotPasswordRoute() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
