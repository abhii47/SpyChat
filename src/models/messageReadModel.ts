import { DataTypes } from "sequelize";
import sequelize from "../config/db";

export const MessageRead = sequelize.define("message_read",{
    message_read_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    message_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    read_at:{
        type:DataTypes.DATE,
        allowNull:false,
    }
},{
    timestamps:false,
    indexes:[
        {fields:["message_id"]},
        {fields:["user_id"]},
        {fields:["message_id","user_id"]}
    ]
});