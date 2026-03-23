import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from 'next-pwa';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const withPWA = withPWAInit({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/lasspuntacana\.com\/(en|es|fr|it|ru|de|ht)\/properties(\?.*)?$/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'properties-pages',
                expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 5 // 5 minutes
                },
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        },
        {
            urlPattern: /^https:\/\/lasspuntacana\.com\/(en|es|fr|it|ru|de|ht)\/$/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'home-pages',
                expiration: {
                    maxEntries: 7,
                    maxAgeSeconds: 60 * 10 // 10 minutes
                },
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        },
        {
            urlPattern: /^https:\/\/lasspuntacana\.com\/api\/.*/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-calls',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 2 // 2 minutes
                },
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        }
    ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/dsriyqmoy/image/upload/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
            },
        ],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
    },
    async headers() {
        return [
            {
                source: '/_next/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            },
            {
                source: '/images/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            },
            {
                source: '/api/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=60, stale-while-revalidate=300'
                    }
                ]
            },
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://images.pexels.com https://www.google-analytics.com https://*.tile.openstreetmap.org https://lasspuntacana.com https://www.googletagmanager.com https://www.clarity.ms https://c.clarity.ms https://c.bing.com https://assets.mixkit.co; connect-src 'self' data: blob: https://api.cloudinary.com https://res.cloudinary.com https://api.exchangerate-api.com https://www.google-analytics.com https://fonts.gstatic.com https://analytics.google.com https://region1.analytics.google.com https://*.clarity.ms https://www.clarity.ms; frame-src 'self' https://www.youtube.com https://player.vimeo.com https://my.matterport.com https://www.google.com https://vars.hotjar.com; media-src 'self' https://res.cloudinary.com https://assets.mixkit.co;"
                    }
                ]
            }
        ];
    },
    compress: true,
    poweredByHeader: false,
    swcMinify: true,
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['lucide-react', '@headlessui/react'],
        modularizeImports: {
            'lucide-react': {
                transform: 'lucide-react/dist/icons/{{kebabCase member}}',
                skipDefaultConversion: true
            }
        }
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        priority: -10,
                        chunks: 'all',
                    },
                },
            };
        }
        return config;
    },
};

export default withNextIntl(withPWA(nextConfig));
