const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl,
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000,
    exclude: ['/admin/*'],
    robotsTxtOptions: {
        additionalSitemaps: [`${siteUrl}/sitemap.xml`],
    },
};

