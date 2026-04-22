import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../config/db";

export class Conversation extends Model<
    InferAttributes<Conversation, { omit: "created_at" | "updated_at" }>,
    InferCreationAttributes<Conversation, { omit: "created_at" | "updated_at" }>
> {
    declare conversation_id: CreationOptional<number>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

Conversation.init({
    conversation_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
},{
    sequelize,
    modelName:"conversation",
    timestamps:true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes:[
        {fields:['conversation_id']}
    ]
});
