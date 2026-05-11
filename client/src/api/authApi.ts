import axios from "axios";
import type { AuthResponse, User } from "../types";
import axiosInstance from "./axiosInstance";

export const register = async (formData:FormData):Promise<void> => {
    await axiosInstance.post('/api/auth/register', formData, {
        headers: { 'Content-Type' : 'multipart/form-data' },
    })
}

export const login = async ( email:string, password:string ):Promise<AuthResponse> => {
    const res = await axiosInstance.post('/api/auth/login', { email, password })
    return res.data.data;
}

export const refresh = async ():Promise<string> => {
    const res = await axios.post('/api/auth/refresh',{},{
        withCredentials:true,
    });
    return res.data.data.accessToken;
}

export const logout = async ():Promise<void> => {
    await axiosInstance.post('/api/auth/logout')
}

export const getMe = async ():Promise<User> => {
    const res = await axiosInstance.get('/api/auth/me')
    return res.data.data;
}