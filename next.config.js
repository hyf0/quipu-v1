const path = require('path')

var VirtualModulesPlugin = require('webpack-virtual-modules')

var virtualModules = new VirtualModulesPlugin({
  [path.join(__dirname, 'hello.json')]: 'module.exports = { foo: "foo" };',
  'node_modules/module-bar.js': 'module.exports = { bar: "bar" };',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    // Important: return the modified config
    config.plugins.push(virtualModules)
    return config
  },
}

module.exports = nextConfig
