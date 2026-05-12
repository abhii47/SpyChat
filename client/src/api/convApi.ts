import type { Conversation, MessageResponse } from "../types";
import axiosInstance from "./axiosInstance"

export const getMyConversations = async():Promise<Conversation[]> => {
    const res = await axiosInstance.get('/conversations')
    return res.data.data;
}

export const startConversation = async(receiverId:number):Promise<Conversation> => {
    const res = await axiosInstance.post('/conversations', { receiverId })
    return res.data.data;
}

export const getConversationMessages = async(
    id:number,
    page = 1,
    limit = 20
):Promise<MessageResponse> => {
    const res = await axiosInstance.get(`/conversations/${id}/messages?page=${page}&limit=${limit}`)
    return res.data.data;
}