import type { GroupDetail, GroupListItem, MessageResponse } from "../types";
import axiosInstance from "./axiosInstance";

export const getGroups = async():Promise<GroupListItem[]> => {
    const res = await axiosInstance.get('/groups')
    return res.data.data;
}

export const uploadGroupAvatar = async(file:File):Promise<string> => {
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await axiosInstance.post('/groups/upload-avatar',formData,{
        headers: { 'Content-Type' : 'multipart/form-data' },
    })
    return res.data.data;
}

export const getGroupDetail = async(id:number):Promise<GroupDetail> => {
    const res = await axiosInstance.get(`/groups/${id}`)
    return res.data.data;
}

export const getGroupMessages = async(
    id:number,
    page = 1,
    limit = 20
):Promise<MessageResponse> => {
    const res = await axiosInstance.get(`/groups/${id}/messages?page=${page}&limit=${limit}`)
    return res.data.data;
}