import axiosInstance from "./axiosInstance"

export const uploadMedia = async (
    files:File[],
    roomType:'conversation' | 'group',
    roomId:number
) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('media', file))
    formData.append('room_type', roomType)
    formData.append('room_id', roomId.toString())

    const res = await axiosInstance.post('/messages/upload', formData, {
        headers: { 'Content-Type' : 'multipart/form-data' },
    })
    return res.data.data
}

export const getMessage = async(
    roomType:'conversation' | 'group',
    roomId:number,
    page = 1,
    limit = 20
) => {
    const res = await axiosInstance.get(`/messages/${roomType}/${roomId}?page=${page}&limit=${limit}`)
    return res.data.data
}