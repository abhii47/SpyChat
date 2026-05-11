export interface User {
    user_id:number
    name:string
    email:string
    password:string
    avatar:string
    is_active:boolean
    last_seen:Date | null
}

export interface AuthResponse {
    user:User
    accessToken:string
    expires_in:string
}


export interface SocketError {
    event:string
    message:string
}

export interface NotifyPayload {
    message_id?:number
    room?:number
    deletedby?:number
    type?:string
    message?:string
    group_id?: number
    conversation_id?: number
}