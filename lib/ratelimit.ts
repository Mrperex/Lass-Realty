import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Graceful fallback if Upstash env vars are missing
const isUpstashConfigured = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

export const redisClient = isUpstashConfigured
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    : null;

// Create a new ratelimiter that allows 5 requests per 1 minute for leads (anti-spam)
export const leadsRatelimit = redisClient ? new Ratelimit({
    redis: redisClient as any,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
}) : null;

// Allow 30 uploads per hour for Cloudinary signatures (prevents abuse if an admin session is hijacked or endpoint is repeatedly hit)
export const cloudinarySignRatelimit = redisClient ? new Ratelimit({
    redis: redisClient as any,
    limiter: Ratelimit.slidingWindow(30, "1 h"),
    analytics: true,
}) : null;

// Helper to check limit, returns true if allowed or if redis is not configured (fails open)
export async function checkRateLimit(limiter: Ratelimit | null, ip: string): Promise<boolean> {
    if (!limiter) return true;
    try {
        const { success } = await limiter.limit(`ratelimit_${ip}`);
        return success;
    } catch (e) {
        console.warn("Rate limit check failed (failing open):", e);
        return true;
    }
}
