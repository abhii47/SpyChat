import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../config/db";

export class MessageRead extends Model<InferAttributes<MessageRead>, InferCreationAttributes<MessageRead>> {
    declare message_read_id: CreationOptional<number>;
    declare message_id: number;
    declare user_id: number;
    declare read_at: Date;
}

MessageRead.init({
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
    sequelize,
    modelName:"message_read",
    timestamps:false,
    indexes:[
        {fields:["message_id"]},
        {fields:["user_id"]},
        {fields:["message_id","user_id"]}
    ]
});
