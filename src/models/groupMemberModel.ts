import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../config/db";

export class GroupMember extends Model<InferAttributes<GroupMember>, InferCreationAttributes<GroupMember>> {
    declare group_member_id: CreationOptional<number>;
    declare group_id: number;
    declare user_id: number;
    declare role: CreationOptional<"admin" | "member">;
    declare joined_at: CreationOptional<Date>;
    declare left_at: Date | null;
}

GroupMember.init({
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
    sequelize,
    modelName:"group_memeber",
    timestamps:false,
    indexes:[
        {fields:["group_id"]},
        {fields:["user_id"]},
        {fields:["group_id","user_id"],unique:true},
        {fields:["group_id","role"]},
        {fields:["group_id","left_at"]}
    ]
});
