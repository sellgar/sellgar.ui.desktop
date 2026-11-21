import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { NextConfig } from 'next';

import { withApp } from '@sellgar/app/next';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  allowedDevOrigins: ['127.0.0.1'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'dev.sellgar.ru', pathname: '/api/client/v1/files/*', search: '' },
      { protocol: 'https', hostname: 'cdn.dev.sellgar.ru', pathname: '/images/*', search: '' },
      { protocol: 'https', hostname: 'cdn.sellgar.ru', pathname: '/images/*', search: '' },
    ],
    // Dev DNS resolves this gateway to the private address of our K3s VM.
    dangerouslyAllowLocalIP: true,
    maximumRedirects: 0,
  },
  outputFileTracingRoot: root,
  turbopack: { root },
};

export default withApp(nextConfig, { application: './src/application/desktop.application.ts' });
