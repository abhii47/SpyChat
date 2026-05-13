// ************************************* AUTH TYPES *************************************
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

// ************************************* MESSAGE TYPES *************************************

export interface MessageMedia {
    url:string,
    public_id:string,
    type:"image" | "file"
}

export interface Message {
    message_id:number,
    sender_id:number,
    conversation_id:number | null,
    group_id:number | null,
    content:string,
    type:'text' | 'media',
    media:MessageMedia[] | null,
    sender:User
    created_at:Date,
    updated_at:Date

}

export interface Pagination  {
    total_page:number,
    current_page:number,
    next_page:number | null,
    prev_page:number | null,
    limit:number,
    total_messages:number
}

export interface MessageResponse {
    pagination:Pagination,
    messages:Message[]
}

// ************************************* CONVERSATION TYPES *************************************

export interface ConversationMember {
    conversation_member_id:number,
    user:User
    created_at:Date,
}

export interface Conversation {
    conversation_id:number,
    members:ConversationMember[],
    lastMessage:Message | null,
    unread_count:number,
    updated_at:Date
}


// ************************************* GROUP TYPES *************************************

export interface GroupMember {
    group_member_id:number,
    user_id:number,
    name:string,
    avatar:string,
    role:'admin' | 'member',
    joined_at:Date,
}

export interface Group {
    group_id:number,
    name:string,
    description:string | null,
    avatar:string,
    created_by:number,
    created_at:Date,
}

export interface GroupListItem {
    group:Group & {
        admin:{
            user_id:number,
            name:string,
            avatar:string
        }
    }
    role:'admin' | 'member',
    joined_at:Date,
    last_message:Message | null,
    unread_count:number
}

export interface GroupDetail {
    group_id:number,
    name:string,
    description:string,
    avatar:string,
    created_at:Date,
    admin:{
        user_id:number,
        name:string,
        avatar:string
    },
    members:GroupMember[],
}

// ************************************* SEARCH TYPES *************************************

export interface SearchUser extends User {
    is_online:boolean
}

export interface SearchUserResult {
    total:number,
    limit:number,
    offset:number,
    users:SearchUser[]
}

export interface SearchGroupResult {
    totalResult:number,
    limit:number,
    page:number,
    groups:Group[]
}

// ************************************* SOCKET TYPES *************************************

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

// ************************************* UI TYPES *************************************
export interface ActiveChat {
    type:'conversation' | 'group',
    id:number
}