/** @type {import('next').NextConfig} */

const os = require("os");

/**
 * PCのプライベートIPアドレスを取得します。
 */
function getIpAddress() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    const net = nets[name]?.find((v) => v.family == "IPv4");
    return !!net ? net.address : null;
  }
}

const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    ipAddress: getIpAddress(),
  },
};

module.exports = nextConfig;
