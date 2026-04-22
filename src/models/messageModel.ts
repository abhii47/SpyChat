import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../config/db";

export class Message extends Model<
    InferAttributes<Message, { omit: "created_at" | "updated_at" }>,
    InferCreationAttributes<Message, { omit: "created_at" | "updated_at" }>
> {
    declare message_id: CreationOptional<number>;
    declare sender_id: number;
    declare conversation_id: number | null;
    declare group_id: number | null;
    declare content: string;
    declare type: CreationOptional<"text" | "image" | "file">;
    declare media_url: string | null;
    declare media_public_id: string | null;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

Message.init({
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
    sequelize,
    modelName:"message",
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
