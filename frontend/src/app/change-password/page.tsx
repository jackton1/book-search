"use client";
import { retrieveChangePasswordKey } from "@/actions/user";
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
    message: '',
    key: undefined,
}

export default function ChangePassword() {
    const [state, formAction] = useFormState(retrieveChangePasswordKey, initialState);

    useEffect(() => {
        if (state.success && state.key) {
            toast.success(state.message, { icon: '✅' });
            redirect(`/change-password/${state.key}`);
        } else if (state.message) {
            toast.error(state.message, { icon: '🚨' });
        }
    }, [state]);

    return (
        <AuthLayout>
            <AuthHeader
                title="Change Password"
                subtitle="BookSphere Password Reset"
                introText="Please enter your email address to reset your password."
            />
            <form
                className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
                action={formAction}
            >
                <FormInput id="email" name="email" type="email" placeholder="user@acme.com" label="Email Address" />
                <SubmitButton
                    text="Change Password"
                    loadingText="Changing password..."
                    className="flex h-10 w-full items-center justify-center rounded-md border bg-blue-500 text-sm text-white transition-all focus:outline-none"
                />
                <AuthNavigationLink message="Remember your password?" href="/login" linkText="Sign in" postMessage="to continue." />
            </form>
        </AuthLayout>
    );
}
