"use client";
import { loginUser } from "@/actions/user";
import AuthHeader from "@/components/auth-header";
import AuthLayout from "@/components/auth-layout";
import AuthNavigationLink from "@/components/auth-navigation-link";
import FormInput from "@/components/form-input";
import SubmitButton from "@/components/submit-button";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";


const initialState = {
    success: false,
    message: '',
    redirectTo: '',
}

export default function Login() {
  const router = useRouter()
  const [state, formAction] = useFormState(loginUser, initialState);

    useEffect(() => {
        if (state.success && state.redirectTo) {
            toast.success(state.message, { icon: '👋', duration: 4000 });
            router.push(state.redirectTo);
        } else if (!state.success && state.message) {
            toast.error(state.message, { icon: '🚨' });
        } else if (state.success) {
            toast.success(state.message, { icon: '👋', duration: 4000 });
        }
    }, [state]);

  return (
      <AuthLayout>
        <AuthHeader
            title="Sign In"
            subtitle="Welcome to BookSphere!"
            introText="Please sign in to continue."
        />
        <form className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16" action={formAction}>
          <FormInput id="email" name="email" type="email" placeholder="user@acme.com" label="Email Address" />
          <FormInput id="password" name="password" type="password" placeholder="" label="Password" />
          <SubmitButton
            text="Sign In"
            loadingText="Signing in..."
            className="flex h-10 w-full items-center justify-center rounded-md border bg-blue-500 text-sm text-white transition-all focus:outline-none"
          />
          <AuthNavigationLink message="Don't have an account?" href="/register" linkText="Sign up" postMessage="for free." />
          <AuthNavigationLink message="Forgot your password?" href="/change-password" linkText="Reset password" postMessage="." />
        </form>
      </AuthLayout>
  );
}
