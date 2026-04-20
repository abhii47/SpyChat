import { DataTypes } from "sequelize";
import sequelize from "../config/db";

export const Message = sequelize.define("message",{
    message_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    sender_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    conversation_id:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    group_id:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    content:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    type:{
        type:DataTypes.ENUM("text","image","file"),
        defaultValue:"text",
    },
    media_url:{
        type:DataTypes.STRING,
        allowNull:true
    },
    media_public_id:{
        type:DataTypes.STRING,
        allowNull:true
    }
},{
    timestamps:true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes:[
        {fields:["sender_id"]},
        {fields:["conversation_id","created_at"]},
        {fields:["group_id","created_at"]},
        {fields:["conversation_id","type"]}
    ]
});