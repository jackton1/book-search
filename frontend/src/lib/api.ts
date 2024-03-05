import axios, { AxiosInstance, AxiosResponse } from "axios";

const API_URL: string = process.env.API_URL as string;

export interface AuthToken {
    accessToken: string;
}

export const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    validateStatus: (status: number): boolean => status < 500 // resolve the promise if status code is less than 500
});

export const setAuthHeader = (accessToken: string) => ({
    headers: {Authorization: `Bearer ${accessToken}`}
});

export const handleError = (response: AxiosResponse) => {
    if (response.status >= 400 && response.status < 600) {
        if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
            if (response.data.detail) {
                throw new Error(response.data.detail);
            } else {
                const errors = Object.entries(response.data)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');
                throw new Error(errors);
            }
        } else if (response.statusText) {
            throw new Error(response.statusText);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
    return response.data;
};

