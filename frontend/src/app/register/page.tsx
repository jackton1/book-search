"use client";
import { useFormState } from 'react-dom'
import { redirect } from 'next/navigation';
import SubmitButton from "@/components/submit-button";
import AuthLayout from "@/components/auth-layout";
import AuthHeader from "@/components/auth-header";
import FormInput from "@/components/form-input";
import AuthNavigationLink from "@/components/auth-navigation-link";
import toast from "react-hot-toast";
import { addNewUser } from "@/actions/user";
import { useEffect } from "react";


const initialState = {
    success: false,
    message: '',
}

export default function Login() {
    const [state, formAction] = useFormState(addNewUser, initialState);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message, { icon: '👋', duration: 4000 });
            redirect('/login');
        } else if (state.message) {
            toast.error(state.message, { icon: '🚨' });
        }
    }, [state]);

    return (
        <AuthLayout>
          <AuthHeader
            title="Sign Up"
            subtitle="BookSphere Registration"
            introText="Enter your details to create an account."
          />
          <form className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16" action={formAction}>
              <FormInput id="name" name="name" type="text" placeholder="John Doe" label="Name" />
              <FormInput id="email" name="email" type="email" placeholder="user@acme.com" label="Email Address" />
              <FormInput id="password" name="password" type="password" placeholder="" label="Password" />
              <SubmitButton
                text="Sign Up"
                loadingText="Signing up..."
                className="flex h-10 w-full items-center justify-center rounded-md border bg-blue-500 text-sm text-white transition-all focus:outline-none"
              />
              <AuthNavigationLink message="Already have an account?" href="/login" linkText="Sign in instead." />
          </form>
        </AuthLayout>
  );
}
