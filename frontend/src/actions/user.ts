'use server';
import { signIn, signOut } from "@/auth";
import { createUser } from "@/lib/user";

export const addNewUser = async (_: any, formData: FormData)=> {
    let name = formData.get('name') as string;
    let email = formData.get('email') as string;
    let password = formData.get('password') as string;
    try {
        await createUser({ name, email, password });
        return { success: true, message: 'Account created successfully. Please sign in.'}
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export const loginUser = async (_: any, formData: FormData) => {
    let email = formData.get('email') as string;
    let password = formData.get('password') as string;
    try {
        await signIn('credentials', {
            redirect: false,
            username: email,
            password,
        });
        return { success: true, message: 'Welcome back!', redirectTo: "/books" }
    } catch (error: any) {
        return { success: false, message: "Invalid email or password. Please try again." }
    }
}

export const logoutUser = async () => {
    try {
        await signOut({ redirect: false });
        return { success: true, message: 'You have been signed out.', redirectTo: "/login" }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}
