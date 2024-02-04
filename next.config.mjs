/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains: ['utfs.io'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs',
                port: ''
            }
        ]
    }
};

export default nextConfig;
