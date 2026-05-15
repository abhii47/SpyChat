import type { Socket } from "socket.io-client";
import { useGroupStore } from "../store/groupStore";
import { useUiStore } from "../store/uiStore";
import toast from "react-hot-toast";

export const registerGroupEvents = (socket:Socket) => {
    socket.on('create_group_success', ({ group }:any) => {
        useGroupStore.getState().addGroup({
            group,
            role:"admin",
            joined_at: new Date().toISOString(),
            last_message: null,
            unread_count: 0
        })

        useUiStore.getState().setActiveChat({
            type:'group',
            id:group.group_id
        })

        toast.success(`Group "${group.name}" created!`)
    });

    socket.on('added_to_group', ({ group, added_by }:any) => {
        useGroupStore.getState().addGroup({
            group,
            role:"member",
            joined_at: new Date().toISOString(),
            last_message: null,
            unread_count: 0
        })
        toast.success(`You were added to "${group.name} by "${added_by.name}"`)
    })

    socket.on('member_added', ({ new_member }: any) => {
        toast(`New member "${new_member.name}" added to group`)
    })

    socket.on('member_removed', () => {
        toast(`A member was removed from group`)
    })

    socket.on('member_left', () => {
        toast(`A member left the group`)
    })

    socket.on('leave_group_success', ({ group_id }: any) => {
        useGroupStore.getState().removeGroup(group_id)

        const activeChat = useUiStore.getState().activeChat
        if (activeChat?.type === 'group' && activeChat.id === group_id) {
        useUiStore.getState().setActiveChat(null)
        }

        toast.success('Left the group')
    })
}