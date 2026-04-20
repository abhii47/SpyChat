import { DataTypes } from "sequelize";
import sequelize from "../config/db";

export const GroupMember = sequelize.define("group_memeber",{
    group_member_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    group_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    role:{
        type:DataTypes.ENUM("admin","member"),
        allowNull:false,
        defaultValue:"member"
    },
    joined_at:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue:DataTypes.NOW
    },
    left_at:{
        type:DataTypes.DATE,
        allowNull:true
    }
},{
    timestamps:false,
    indexes:[
        {fields:["group_id"]},
        {fields:["user_id"]},
        {fields:["group_id","user_id"],unique:true},
        {fields:["group_id","role"]},
        {fields:["group_id","left_at"]}
    ]
});