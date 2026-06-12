import { createClient } from "redis";

const redis = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_SOCKET_HOST,
    port: Number.parseInt(String(process.env.REDIS_PORT)),
  },
});

redis.on("error", (err) => console.log("Redis Client Error", err));

await redis.connect();

const redisPub = redis.duplicate();
const redisSub = redis.duplicate();

await redisPub.connect();
await redisSub.connect();

export { redis, redisPub, redisSub };
