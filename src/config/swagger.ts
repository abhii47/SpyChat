import swaggerJSDoc from "swagger-jsdoc";
import { getEnv } from "./env";

const options:swaggerJSDoc.Options = {
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Spychat API",
            version:"1.0.0",
            description:"Spychat API Documentation",
        },
        servers:[
            {
                url:`${getEnv("APP_URL")}/api`
            }
        ],
        components:{
            securitySchemes:{
                BearerAuth:{
                    type:"http",
                    scheme:"bearer",
                    bearerFormat:"JWT",
                    description:"JWT Authorization",
                }
            },
            schemas:{
                SuccessResponse:{
                    type:"object",
                    properties:{
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Operation successful" },
                        data: { type: "object" },
                    },
                },
                ErrorResponse:{
                    type:"object",
                    properties:{
                        success: { type: "boolean", example: false },
                        message: { type: "string", example: "Something went wrong" },
                    },
                },
                User:{
                    type:"object",
                    properties:{
                        user_id: { type: "integer", example:1 },
                        name: { type: "string", example: "Abhi" },
                        email: { type: "string", example: "abhi@example.com" },
                        avatar: { type: "string", example: "https://cloudinary.com/..." },
                        is_active: { type: "boolean", example: true },
                        last_seen: { type: "string", format: "date-time", nullable: true },
                        is_online: { type: "boolean", example: false },
                    },
                },
                Message:{
                    type:"object",
                    properties:{
                        message_id: { type:"integer", example:1 },
                        content: { type:"string", example:"Hello" },
                        type: { type:"string", enum:["text","media"] },
                        media:{
                            type:"array",
                            nullable:true,
                            items:{
                                type:"object",
                                properties:{
                                    url:{ type:"string" },
                                    public_id:{ type:"string" },
                                    type:{ type:"string",enum:["image","file"] }
                                },
                            },
                        },
                        created_at:{ type: "string", format: "date-time" },
                        sender: { $ref: "#/components/schemas/User" },
                    },
                },
                Pagination:{
                    type:"object",
                    properties:{
                        total_page:{ type:"integer", example:90 },
                        page:{ type:"integer", example:2 },
                        limit:{ type:"integer", example:20 },
                        next_page:{ type:"integer", nullable:true, example:2 }, 
                        prev_page:{ type:"integer", nullable:true, example:1 },
                    },
                },
            },
        },
        security:[{
            BearerAuth:[]
        }],
    },
    apis:["./src/docs/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);