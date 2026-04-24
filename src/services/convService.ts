import { ConversationMember } from "../models"

export const getConvMembers = async(user_id:number) => {
    const members = await ConversationMember.findAll({
        where:{ user_id }
    });
    return members;
}

export default {
    getConvMembers
}