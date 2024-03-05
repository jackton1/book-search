'use server';
import { auth } from "@/auth";
import { searchBooks } from "@/lib/book";


export const getBooks = async (prevState: any, formData: FormData) => {
    const session = await auth();

    if (!session) {
        return {
            success: false,
            message: "You need to be signed in to view this page.",
            redirectTo: "/login"
        }
    }

    const search = formData.get('search') as string;
    const page = formData.get('page') as string || '0';

    try {
        const data = await searchBooks({q: search, page, accessToken: session.accessToken});

        return { success: true, data }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}
