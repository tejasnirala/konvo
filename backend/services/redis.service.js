import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10),
  password: process.env.REDIS_PASSWORD,
  retryStrategy(times) {
    // reconnect after
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
})

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

export default redisClient;