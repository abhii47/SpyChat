import { Conversation, ConversationMember, Message, MessageRead, User } from "../models"
import AppError from "../utils/appError";
import logger from "../utils/logger";
import sequelize from "../config/db";
import { Op } from "sequelize";

export const startConversation = async (user_id: number, receiverId: number) => {

    if (user_id === receiverId) {
        logger.warn(`User ${user_id} tried to start a conversation with himself`);
        throw new AppError("You can't chat with yourself", 400);
    }

    const existingConversation = await ConversationMember.findOne({
        where: { user_id },
        include: [
            {
                model: Conversation,
                as:"conversation",
                required: true,
                include: [
                    {
                        model: ConversationMember,
                        as:"members",
                        where: { user_id: receiverId },
                        required: true
                    }
                ]
            }
        ]
    });

    if (existingConversation) {
        logger.info("Conversation already exist", { conversation: existingConversation.conversation_id });
        return { conversation: existingConversation, isNew: false }
    }

    // Create new conversation if not exist
    const t = await sequelize.transaction();
    try {

        const conversation = await Conversation.create({}, { transaction: t });

        await ConversationMember.bulkCreate(
            [
                { conversation_id: conversation.conversation_id, user_id },
                { conversation_id: conversation.conversation_id, user_id: receiverId }
            ],
            { transaction: t }
        );

        await t.commit();
        logger.info(`New conversation ${conversation.conversation_id} created`);
        return { conversation, isNew: true };
    } catch (err: any) {
        await t.rollback();
        logger.error("Conversation Creation : failed", { stack: err.stack });
        throw err;
    }

}

export const getMyConversations = async (user_id: number) => {
    const conversations = await ConversationMember.findAll({
        where: { user_id },
        include: [
            {
                model: Conversation,
                as: "conversation",
                include: [
                    {
                        model: ConversationMember,
                        as: "members",
                        where: { user_id: { [Op.ne]: user_id } },
                        attributes:["conversation_member_id","created_at"],
                        include: [
                            {
                                model: User,
                                as: "user",
                                attributes: ["user_id", "name", "avatar", "last_seen"],
                            }
                        ]
                    },
                    {
                        model: Message,
                        as: "messages",
                        limit: 1,
                        order: [['created_at', 'DESC']],
                        separate:true
                    }
                ]
            }
        ]
    });
    const result = Promise.all(
        conversations.map(async(m:any) => {
            const conv = m.conversation;

            const unreadMessages = await Message.findAll({
                where:{ 
                    conversation_id:conv.conversation_id,
                    sender_id:{ [Op.ne]:user_id },
                },
                attributes:{ exclude:['media'] },
                include:[
                    {
                        model:MessageRead,
                        as:"reads",
                        where:{ user_id },
                        required:false
                    }
                ],
            });

            const unreadCount = unreadMessages.filter(
                (msg:any) => msg.reads.length === 0
            );

            return {
                conversation_id: conv.conversation_id,
                members: conv.members,
                lastMessage: conv.messages?.[0] || null,
                unreadCount:unreadCount.length,
            };
        })
    );
    return result;

}

export const getConversationMessages = async(
    user_id:number,
    conversation_id:number,
    limit:number = 20,
    offset:number = 0
) => {
    const isMember = await ConversationMember.findOne({
        where:{
            conversation_id,
            user_id
        }
    });

    if(!isMember){
        logger.warn("User is not member of this conversation");
        throw new AppError("You are not a member of this conversation", 403);
    }

    const messages = await Message.findAndCountAll  ({
        where:{
            conversation_id,
        },
        limit,
        offset,
        attributes:{exclude:['group_id','media']},
        order:[['created_at','DESC']],
        include:[
            {
                model:User,
                as:"sender",
                attributes:["user_id","name","avatar"]
            },
        ]

    });
    return {
        total:messages.count,
        limit,
        offset,
        messages:messages.rows
    };
}

export const getConvMembers = async (user_id: number) => {
    const members = await ConversationMember.findAll({
        where: { user_id }
    });
    return members;
}

export default {
    startConversation,
    getMyConversations,
    getConversationMessages,
    getConvMembers
}