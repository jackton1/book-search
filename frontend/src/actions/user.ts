"use server";
import { signIn, signOut } from "@/auth";
import { createUser, getChangePasswordKey, setPassword } from "@/lib/user";

export const addNewUser = async (_: any, formData: FormData) => {
  let name = formData.get("name") as string;
  let email = formData.get("email") as string;
  let password = formData.get("password") as string;
  try {
    await createUser({ name, email, password });
    return { success: true, message: "Account created successfully. Please sign in." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const changePassword = async (_: any, formData: FormData) => {
  let key = formData.get("key") as string;
  let password = formData.get("password") as string;
  try {
    await setPassword({ key, password });
    return { success: true, message: "Password changed successfully. Please sign in." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const retrieveChangePasswordKey = async (_: any, formData: FormData) => {
  let email = formData.get("email") as string;
  try {
    const response = await getChangePasswordKey({ email });
    return {
      success: true,
      key: response.key,
      message: "Your account has been verified. Please enter your new password."
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const loginUser = async (_: any, formData: FormData) => {
  let email = formData.get("email") as string;
  let password = formData.get("password") as string;
  try {
    await signIn("credentials", {
      redirect: false,
      username: email,
      password,
    });
    return { success: true, message: "Welcome back!", redirectTo: "/books" };
  } catch (error: any) {
    return { success: false, message: "Invalid email or password. Please try again." };
  }
};

export const logoutUser = async () => {
  try {
    await signOut({ redirect: false });
    return { success: true, message: "You have been signed out.", redirectTo: "/login" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
