import Redis from "ioredis";
import { getEnv } from "./env";

export const redis = new Redis(getEnv("REDIS_URL"), {
    maxRetriesPerRequest:5,
    retryStrategy:(times) => Math.min(times * 50, 2000)
});

redis.on("connect",() => {
    console.log("Redis Connected Successfully");
});
redis.on("error",(err) => {
    console.error("Redis Connection Error:", err);
});