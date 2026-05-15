import type { SearchUser } from "../types";
import axiosInstance from "./axiosInstance"

export const searchUsers = async(
    query:string,
    limit = 10,
    offset = 0
):Promise<{ total:number, limit:number, offset:number, users:SearchUser[]}> => {
    const res = await axiosInstance.get(`/users/search?query=${query}&limit=${limit}&offset=${offset}`);
    return res.data.data;
}

export const updateProfile = async(formdata:FormData) => {
    const res = await axiosInstance.put(`/users/update`, formdata, {
        headers: {'Content-Type' : 'multipart/form-data' },
    })
    return res.data.data;
}

export const getUserProfile = async(userId:number) => {
    const res = await axiosInstance.get(`/users/${userId}`)
    return res.data.data;
}