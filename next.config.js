const path = require('path')

var VirtualModulesPlugin = require('webpack-virtual-modules')

var virtualModules = new VirtualModulesPlugin({
  [path.join(__dirname, 'hello.json')]: 'module.exports = { foo: "foo" };',
  'node_modules/module-bar.js': 'module.exports = { bar: "bar" };',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false }

    return config
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
