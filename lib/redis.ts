import { Redis } from '@upstash/redis'

// Provide dummy fallback for build environments or missing envs
const getRedisClient = () => {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        return Redis.fromEnv();
    }

    // Return a dummy API that acts like Redis but doesn't do anything
    console.warn('UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is missing. Falling back to local/disabled cache.');
    return {
        get: async () => null,
        set: async () => 'OK',
        setex: async () => 'OK',
        del: async () => 1
    } as unknown as Redis;
}

const redis = getRedisClient();

export default redis;
