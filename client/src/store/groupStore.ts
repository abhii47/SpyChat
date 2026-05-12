import { create } from 'zustand'
import type { GroupListItem, Message } from '../types'

interface GroupState {
    groups:GroupListItem[],
    isLoading:boolean

    setGroups: (groups: GroupListItem[]) => void
    addGroup: (group: GroupListItem) => void
    updateLastMessage: (groupId: number, message: Message) => void
    incrementUnread: (groupId: number) => void
    resetUnread: (groupId: number) => void
    removeGroup: (groupId: number) => void
}

export const useGroupStore = create<GroupState>((set) => ({
    groups:[],
    isLoading:false,

    setGroups: (groups) => set({ groups }),

    addGroup: (group) =>
        set((state) => {
        const exists = state.groups.find(
            (g) => g.group.group_id === group.group.group_id
        )
        if (exists) return state
        return { groups: [group, ...state.groups] }
        }),
    
    updateLastMessage: (groupId, message) =>
        set((state) => ({
        groups: state.groups.map((g) =>
            g.group.group_id === groupId
            ? { ...g, last_message: message }
            : g
        ),
        })),

    incrementUnread: (groupId) =>
        set((state) => ({
        groups: state.groups.map((g) =>
            g.group.group_id === groupId
            ? { ...g, unread_count: g.unread_count + 1 }
            : g
        ),
        })),

    resetUnread: (groupId) =>
        set((state) => ({
        groups: state.groups.map((g) =>
            g.group.group_id === groupId ? { ...g, unread_count: 0 } : g
        ),
        })),

    removeGroup: (groupId) =>
        set((state) => ({
        groups: state.groups.filter((g) => g.group.group_id !== groupId),
        })),

}))