"use client";
import { changePassword } from "@/actions/user";
import AuthHeader from "@/components/auth-header";
import AuthLayout from "@/components/auth-layout";
import AuthNavigationLink from "@/components/auth-navigation-link";
import FormInput from "@/components/form-input";
import SubmitButton from "@/components/submit-button";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";


const initialState = {
  success: false,
  message: "",
};

export default function ChangePasswordWithKey({ params }: { params: { key: string } }) {
  const [state, formAction] = useFormState(changePassword, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message, { icon: "✅", duration: 4000 });
      redirect("/login");
    } else if (state.message) {
      toast.error(state.message, { icon: "🚨" });
    }
  }, [state]);

  return (
    <AuthLayout>
      <AuthHeader
        title="Change Password"
        subtitle="BookSphere Password Reset"
        introText="Please enter your new password."
      />
      <form
        className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
        action={(formData: FormData) => {
          // Verify that the two new passwords match
          const newPassword1 = formData.get("new-password-1") as string;
          const newPassword2 = formData.get("new-password-2") as string;
          if (newPassword1 !== newPassword2) {
            toast.error("The two new passwords do not match. Please try again.", { icon: "🚨" });
            return;
          }
          const newFormData = new FormData();
          newFormData.append("key", params.key);
          newFormData.append("password", newPassword1);
          formAction(newFormData);
        }}
      >
        <FormInput id="new-password-1" name="new-password-1" type="password" placeholder="New Pasword 1"
                   label="New Password"/>
        <FormInput id="new-password-2" name="new-password-2" type="password" placeholder="New Pasword 2"
                   label="Confirm New Password"/>
        <SubmitButton
          text="Change Password"
          loadingText="Changing password..."
          className="flex h-10 w-full items-center justify-center rounded-md border bg-blue-500 text-sm text-white transition-all focus:outline-none"
        />
        <AuthNavigationLink message="Remember your password?" href="/login" linkText="Sign in"
                            postMessage="to continue."/>
      </form>
    </AuthLayout>
  );
}
