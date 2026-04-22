import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../config/db";

export class Group extends Model<
    InferAttributes<Group, { omit: "created_at" | "updated_at" }>,
    InferCreationAttributes<Group, { omit: "created_at" | "updated_at" }>
> {
    declare group_id: CreationOptional<number>;
    declare name: string;
    declare description: string | null;
    declare avatar: string | null;
    declare created_by: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

Group.init({
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
    sequelize,
    modelName:"group",
    timestamps:true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes:[
        {fields:["created_by"]}
    ]
});
