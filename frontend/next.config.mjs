/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "MVNeg7uDpYjgY0yTXOpr/VCzT0U8sXkKWq6ZIufQgUY=",
  },
  images: {
    domains: ["books.google.com"],
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/books",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
