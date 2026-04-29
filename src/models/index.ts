import { User } from "./userModel";
import { Conversation } from "./conversationModel";
import { Group } from "./groupModel";
import { ConversationMember } from "./conversationMemberModel";
import { GroupMember } from "./groupMemberModel";
import { Message } from "./messageModel";
import { MessageRead } from "./messageReadModel";

//**************************** Associations **********************

//Conversation -> ConversationMember (One-to-Many)
Conversation.hasMany(ConversationMember,{
    foreignKey:"conversation_id",
    as:"members"
});
ConversationMember.belongsTo(Conversation,{
    foreignKey:"conversation_id",
    as:"conversation"
});

//User -> ConversationMember (One-to-Many)
User.hasMany(ConversationMember,{
    foreignKey:"user_id",
    as:"conversation_memberships"
});
ConversationMember.belongsTo(User,{
    foreignKey:"user_id",
    as:"user"
});

User.hasMany(Group,{
    foreignKey:"created_by",
    as:"groups"
});
Group.belongsTo(User,{
    foreignKey:"created_by",
    as:"admin"
});

//Group -> GroupMember (One-to-Many)
Group.hasMany(GroupMember,{
    foreignKey:"group_id",
    as:"members"
});
GroupMember.belongsTo(Group,{
    foreignKey:"group_id",
    as:"group"
});

//User -> GroupMember (One-to-Many)
User.hasMany(GroupMember,{
    foreignKey:"user_id",
    as:"group_memeberships",
});
GroupMember.belongsTo(User,{
    foreignKey:"user_id",
    as:"user"
});

//Conversation -> Message (One-to-Many)
Conversation.hasMany(Message,{
    foreignKey:"conversation_id",
    as:"messages"
});
Message.belongsTo(Conversation,{
    foreignKey:"conversation_id",
    as:"conversation"
});

//Group -> Message (One-to-Many)
Group.hasMany(Message,{
    foreignKey:"group_id",
    as:"messages"
});
Message.belongsTo(Group,{
    foreignKey:"group_id",
    as:"group"
});

//User -> Message (One-to-Many)
User.hasMany(Message,{
    foreignKey:"sender_id",
    as:"sent_messages"
});
Message.belongsTo(User,{
    foreignKey:"sender_id",
    as:"sender"
});

//Message -> MessageRead (One-to-Many)
Message.hasMany(MessageRead,{
    foreignKey:"message_id",
    as:"reads"
});
MessageRead.belongsTo(Message,{
    foreignKey:"message_id",
    as:"message"
});

//User -> MessageRead (One-to-Many)
User.hasMany(MessageRead,{
    foreignKey:"user_id",
    as:"message_reads"
});
MessageRead.belongsTo(User,{
    foreignKey:"user_id",
    as:"reader"
});

export { 
    User, 
    Conversation, 
    Group, 
    ConversationMember, 
    GroupMember, 
    Message, 
    MessageRead 
};