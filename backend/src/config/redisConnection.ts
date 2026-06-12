import { Redis } from "ioredis";

export const redisConnection = {
  username: "default",
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_SOCKET_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
};
