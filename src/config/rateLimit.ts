import rateLimit from "express-rate-limit";
import { success } from "zod";

// Login/Register pe strict limit — brute force se bachao
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max:100,
    message:{
        success:false,
        message:"Too many attempts, please try again after 15 minutes",
    },
    standardHeaders:true,
    legacyHeaders:false,
    skipSuccessfulRequests:false
});

// Poori API pe general limit — DDoS se bachao
export const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max:100,
    message:{
        success:false,
        message:"Too many attempts, please slow down",
    },
    standardHeaders:true,
    legacyHeaders:false,
});

// Media upload pe alag limit — Cloudinary bandwidth bachao
export const uploadLimiter = rateLimit({
   windowMs: 60 * 1000,
   max:10,
   message:{
       success:false,
       message:"Too many upload requests, please wait a minute",
   },
   standardHeaders:true,
   legacyHeaders:false 
});