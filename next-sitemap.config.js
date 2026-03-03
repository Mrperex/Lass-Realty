/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://lasspuntacana.com',
    generateRobotsTxt: true, // (optional) Generate a robots.txt
    sitemapSize: 7000,
    exclude: ['/admin', '/admin/*'], // Exclude admin routes from SEO
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
            },
            {
                userAgent: '*',
                disallow: ['/admin', '/api/admin'],
            },
        ],
    },
}
