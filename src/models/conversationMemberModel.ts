import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../config/db";

export class ConversationMember extends Model<
    InferAttributes<ConversationMember, { omit: "created_at" | "updated_at" }>,
    InferCreationAttributes<ConversationMember, { omit: "created_at" | "updated_at" }>
> {
    declare conversation_member_id: CreationOptional<number>;
    declare conversation_id: number;
    declare user_id: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

ConversationMember.init({
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
    sequelize,
    modelName:"conversation_member",
    timestamps:true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes:[
        {fields:["conversation_id"]},
        {fields:["user_id"]},
        {fields:["conversation_id","user_id"],unique:true}
    ]
});
