"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [authorizationError, setAuthorizationError] = useState(false);

  useEffect(() => {
    setAuthorizationError(new URLSearchParams(window.location.search).get("error") === "not-authorized");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    const supabase = createSupabaseClient();

    if (!supabase) {
      setError("Add your Supabase URL and anon key to .env.local first.");
      setIsSubmitting(false);
      return;
    }

    if (!email || !email.includes("@")) {
      setError("Enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsSubmitting(false);
      return;
    }

    if (isRegistering) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(formatAuthError(signUpError.message));
        setIsSubmitting(false);
        return;
      }

      if (data.session) {
        router.push("/admin");
        router.refresh();
        return;
      }

      setMessage("Account created. Check your email to confirm your account, then sign in.");
      setIsRegistering(false);
      setIsSubmitting(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(formatAuthError(signInError.message));
      setIsSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-4">
      <div className="w-full max-w-md rounded-[26px] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">Admin access</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-stone-900">
            {isRegistering ? "Create account" : "Sign in"}
          </h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-700">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="w-full rounded-xl border border-stone-200 bg-[#fafaf7] px-3 py-2.5 text-stone-900 outline-none transition focus:border-[#2F5D3A]" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-stone-700">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="w-full rounded-xl border border-stone-200 bg-[#fafaf7] px-3 py-2.5 text-stone-900 outline-none transition focus:border-[#2F5D3A]" />
          </div>
          {isRegistering && (
            <p className="text-xs leading-5 text-stone-500">
              Use at least 6 characters. An administrator must approve your account before dashboard access is granted.
            </p>
          )}
          {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {authorizationError && (
            <p role="alert" className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Your credentials are valid, but this account is not an admin yet. Add your user to the admin profile in Supabase.
            </p>
          )}
          {message && <p role="status" className="rounded-xl bg-[#edf3ed] px-3 py-2 text-sm text-[#2F5D3A]">{message}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-[#2F5D3A] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#24462f] disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? (isRegistering ? "Creating account..." : "Signing in...") : isRegistering ? "Create account" : "Log in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-stone-600">
          <button
            type="button"
            onClick={() => {
              setIsRegistering((current) => !current);
              setError("");
              setMessage("");
            }}
            className="font-medium text-[#2F5D3A] hover:underline"
          >
            {isRegistering ? "Already have an account? Sign in" : "Need an account? Register"}
          </button>
          <span className="mx-2 text-stone-300">|</span>
          <Link href="/" className="font-medium text-[#2F5D3A]">Return home</Link>
        </div>
      </div>
    </main>
  );
}

function formatAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Email or password is incorrect. Create the account first, or reset the password in Supabase Auth.";
  }

  if (normalized.includes("user already registered")) {
    return "That email is already registered. Switch to Sign in.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Confirm your email address before signing in, or enable auto-confirm in Supabase Auth settings.";
  }

  return message;
}
