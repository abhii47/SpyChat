import { DataTypes } from "sequelize";
import sequelize from "../config/db";

export const ConversationMember = sequelize.define("conversation_member",{
    conversation_member_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    conversation_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    timestamps:true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes:[
        {fields:["conversation_id"]},
        {fields:["user_id"]},
        {fields:["conversation_id","user_id"],unique:true}
    ]
});