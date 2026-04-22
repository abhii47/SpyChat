import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../config/db";

export class User extends Model<
    InferAttributes<User, { omit: "created_at" | "updated_at" | "deleted_at" }>,
    InferCreationAttributes<User, { omit: "created_at" | "updated_at" | "deleted_at" }>
> {
    declare user_id: CreationOptional<number>;
    declare name: string;
    declare email: string;
    declare password: string;
    declare avatar: string | null;
    declare is_active: CreationOptional<boolean>;
    declare last_seen: Date | null;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare deleted_at: CreationOptional<Date | null>;
}

User.init({
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
    sequelize,
    modelName:"user",
    timestamps:true,
    paranoid:true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    indexes:[
        {fields:["email"],unique:true},
        {fields:["is_active"]},
        {fields:["last_seen"]}
    ]
});
