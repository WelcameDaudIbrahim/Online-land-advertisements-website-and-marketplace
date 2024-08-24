/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "picsum.photos",
      //   port: "",
      //   pathname: "**",
      // },
      {
        protocol: process.env.NEXT_PUBLIC_SITE_URL.split("://")[0],
        hostname: process.env.NEXT_PUBLIC_SITE_URL.split(":")[1].replace(
          "//",
          ""
        ),
        port: process.env.NEXT_PUBLIC_SITE_URL.split(":").at(-1) || "",
        pathname: "/api/images/**",
      },
    ],
  },
};
export default nextConfig;
