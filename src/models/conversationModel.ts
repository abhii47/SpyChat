import { DataTypes } from "sequelize";
import sequelize from "../config/db";

export const Conversation = sequelize.define("conversation",{
    conversation_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
},{
    timestamps:true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes:[
        {fields:['conversation_id']}
    ]
});