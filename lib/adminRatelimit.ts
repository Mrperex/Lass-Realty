import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis =
    process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN
        ? new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        })
        : null

export const adminRatelimit = redis
    ? new Ratelimit({
        redis: redis as any,
        limiter: Ratelimit.slidingWindow(60, '1 m'),
        prefix: 'admin_rl',
        analytics: true,
    })
    : null

export async function checkAdminRateLimit(userId: string): Promise<{ success: boolean }> {
    if (!adminRatelimit) return { success: true }

    try {
        const { success } = await adminRatelimit.limit(`admin_${userId}`)
        return { success }
    } catch {
        // fail open — operators must never be blocked by Redis downtime
        return { success: true }
    }
}
