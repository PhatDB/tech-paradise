process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'localhost',
                port: '5000',
                pathname: '/**',
            },
        ],
    },
    matcher: ['/admin/:path*'],
}

module.exports = nextConfig

