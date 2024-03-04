import { api, handleError } from "@/lib/api";

interface UserData {
    name: string;
    email: string;
    password: string;
}

export interface User {
    name: number;
    email: string;
}

export async function createUser(user: UserData): Promise<User> {
    const response = await api.post('/user/', {...user}, { headers: { 'Content-Type': 'application/json' } });
    return handleError(response);
}
