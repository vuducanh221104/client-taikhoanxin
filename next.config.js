const path = require('path');

module.exports = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'taikhoanxin.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.taikhoanxin.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'api.vietqr.io',
                pathname: '/**',
            },
        ],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    // Performance optimizations
    swcMinify: true,
    compress: true,
    poweredByHeader: false,
    // Tối ưu font loading
    optimizeFonts: true,
    // Experimental features for better performance
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['lucide-react', '@/components'],
        // Giảm preload không cần thiết
        adjustFontFallbacksWithSizeAdjust: true,
    },
    // Webpack config để tối ưu chunks
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Tối ưu code splitting
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        default: false,
                        vendors: false,
                        // Vendor chunk
                        vendor: {
                            name: 'vendor',
                            chunks: 'all',
                            test: /node_modules/,
                            priority: 20,
                        },
                        // Common chunk
                        common: {
                            name: 'common',
                            minChunks: 2,
                            chunks: 'all',
                            priority: 10,
                            reuseExistingChunk: true,
                            enforce: true,
                        },
                    },
                },
            };
        }
        return config;
    },
};

