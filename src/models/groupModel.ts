import { DataTypes } from "sequelize";
import sequelize from "../config/db";

export const Group = sequelize.define("group",{
    group_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    description:{
        type:DataTypes.STRING,
        allowNull:true
    },
    avatar:{
        type:DataTypes.STRING,
        allowNull:true
    },
    created_by:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    timestamps:true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes:[
        {fields:["created_by"]}
    ]
});