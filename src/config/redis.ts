import Redis from "ioredis";
import { getEnv } from "./env";
import logger from "../utils/logger";

export const redis = new Redis(getEnv("REDIS_URL"), {
    maxRetriesPerRequest:5,
    retryStrategy:(times) => Math.min(times * 50, 2000)
});

redis.on("connect",() => {
    logger.info("Redis Connected Successfully");
});
redis.on("error",(err:Error) => {
    logger.error("Redis Connection Error:",{
        stack:err.stack
    });
});