import { api, handleError } from "@/lib/api";

interface CreateUserData {
    name: string;
    email: string;
    password: string;
}

interface SetPasswordUserData {
    key: string;
    password: string;
}

interface GetChangePasswordKeyData {
    email: string;
}

export interface User {
    name: number;
    email: string;
}

interface ChangePasswordKey {
    key: string;
}

export async function createUser(user: CreateUserData): Promise<User> {
    const response = await api.post('/user/', {...user}, {headers: {'Content-Type': 'application/json'}});
    return handleError(response);
}

export async function setPassword(user: SetPasswordUserData): Promise<User> {
    const response = await api.patch('/user/change-password', user, {headers: {'Content-Type': 'application/json'}});
    return handleError(response);
}

export async function getChangePasswordKey(user: GetChangePasswordKeyData): Promise<ChangePasswordKey> {
    const response = await api.get('/user/get-change-password-key', {params: user});
    return handleError(response);
}
