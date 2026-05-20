import type { Socket } from "socket.io-client";
import { useGroupStore } from "../store/groupStore";
import { useUiStore } from "../store/uiStore";
import toast from "react-hot-toast";

export const registerGroupEvents = (socket:Socket) => {
    socket.on('create_group_success', ({ groupItem }:any) => {
        useGroupStore.getState().addGroup(groupItem)

        useUiStore.getState().setActiveChat({
            type:'group',
            id:groupItem.group.group_id
        })

        toast.success(`Group "${groupItem.group.name}" created!`)
    });

    socket.on('added_to_group', ({ groupItem, added_by }:any) => {
        useGroupStore.getState().addGroup(groupItem)
        toast.success(`You were added to "${groupItem.group.name}" by "${added_by.name}"`)
    })

    socket.on('removed_from_group', ({ group_id, group_name, removed_by }: any) => {
        useGroupStore.getState().removeGroup(group_id)

        const activeChat = useUiStore.getState().activeChat
        if (activeChat?.type === 'group' && activeChat.id === group_id) {
            useUiStore.getState().setActiveChat(null)
        }

        toast.error(`You were removed from "${group_name}" by "${removed_by.name}"`)
    })

    socket.on('member_added', ({ new_member, added_by }: any) => {
        toast.success(`"${new_member.name}" was added by "${added_by.name}"`)
    })

    socket.on('member_removed', ({ removed_by }: any) => {
        toast.error(`A member was removed by "${removed_by.name}"`)
    })

    socket.on('member_left', ({ name }: any) => {
        toast(`"${name}" left the group`)
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