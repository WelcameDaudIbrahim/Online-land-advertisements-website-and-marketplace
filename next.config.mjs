/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bdlord.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "bdlord.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "photos.bdlord.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "photos.bdlord.com",
        port: "",
        pathname: "**",
      },
      // {
      //   protocol: process.env.NEXT_PUBLIC_SITE_URL.split("://")[0],
      //   hostname: process.env.NEXT_PUBLIC_SITE_URL.split(":")[1].replace(
      //     "//",
      //     ""
      //   ),
      //   port:
      //     (process.env.NEXT_PUBLIC_SITE_URL.replace("://", "").includes(":") &&
      //       process.env.NEXT_PUBLIC_SITE_URL.split(":").at(-1)) ||
      //     "",
      //   pathname: "/api/images/**",
      // },
    ],
  },
  // output: "export",
};

export default nextConfig;
