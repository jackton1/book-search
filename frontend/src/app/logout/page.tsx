"use client";
import { logoutUser } from "@/actions/user";
import AuthHeader from "@/components/auth-header";
import AuthLayout from "@/components/auth-layout";
import SubmitButton from "@/components/submit-button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";


const initialState = {
  success: false,
  message: "",
  redirectTo: "",
};

export default function Logout() {
  const [state, formAction] = useFormState(logoutUser, initialState);

  useEffect(() => {
    if (state.success && state.redirectTo) {
      toast.success(state.message, { icon: "👋", duration: 4000 });
      return redirect(state.redirectTo);
    } else if (!state.success && state.message) {
      toast.error(state.message, { icon: "🚨" });
    } else if (state.success) {
      toast.success(state.message, { icon: "👋", duration: 4000 });
    }
  }, [state]);

  return (
    <AuthLayout>
      <AuthHeader
        title="Sign Out"
        subtitle="Goodbye!"
        introText="Are you sure you want to sign out?"
      />
      <form className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16" action={formAction}>
        <SubmitButton
          text="Yes, Sign Out"
          loadingText="Signing out..."
          className="flex h-10 w-full items-center justify-center rounded-md border bg-blue-500 text-sm text-white transition-all focus:outline-none"
        />
        <Link href="/books"
              className="flex h-10 w-full items-center justify-center rounded-md border bg-gray-200 text-sm text-black transition-all focus:outline-none">
          No, Stay Here
        </Link>
      </form>
    </AuthLayout>
  );
}
