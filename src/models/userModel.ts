import { DataTypes } from "sequelize";
import sequelize from "../config/db";

export const User = sequelize.define("user",{
    user_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    avatar:{
        type:DataTypes.STRING,
        allowNull:true
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    last_seen:{
        type:DataTypes.DATE,
        allowNull:true
    }
},{
    timestamps:true,
    paranoid:true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at:",
    indexes:[
        {fields:["email"],unique:true},
        {fields:["is_active"]},
        {fields:["last_seen"]}
    ]
});