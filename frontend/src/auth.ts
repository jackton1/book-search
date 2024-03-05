import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const isAccessTokenExpired = (accessToken: string): boolean => {
  if (!accessToken) {
    return false;
  }

  // Decode the JWT and get the expiry date
  const decoded = JSON.parse(atob(accessToken.split(".")[1]));

  if (!decoded || !decoded.exp) {
    return false;
  }

  // Check if it's expired
  return Date.now() >= decoded.exp * 1000;
};

export const config = {
  providers: [
    CredentialsProvider({
      authorize: async (credentials) => {
        try {
          const body = new URLSearchParams();
          body.append("username", credentials.username as string);
          body.append("password", credentials.password as string);

          // Send the credentials to the Backend API
          const res = await fetch(process.env.API_URL + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body
          });

          const data = await res.json();

          if (res.ok) {
            const { access_token: accessToken } = data;

            // Get the user from the API
            const userRes = await fetch(process.env.API_URL + "/user/", {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });

            const user = await userRes.json();

            return Promise.resolve({
              id: user.id,
              name: user.name,
              email: user.email,
              accessToken
            });
          }
          // If the credentials are invalid, return null
          return Promise.resolve(null);
        } catch (error) {
          console.error("An error occurred: ", error);
          return Promise.resolve(null);
        }
      },
    })
  ],
  session: {
    strategy: "jwt",
    updateAge: 50 * 60,    // 50 minutes
  },
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        // Add the access token to the token object
        token.accessToken = user.accessToken;
      }

      // Check if the access token has expired
      if (isAccessTokenExpired(token.accessToken)) {
        console.log("Access token has expired");
        return Promise.resolve(null);
      }

      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      // Add the access token to the session
      session.accessToken = token.accessToken;
      return session;
    },
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/books") {
        return !!auth && !!auth.accessToken;
      }
      return true;
    },
  },
  theme: {
    colorScheme: "auto",
    logo: "/logo.svg",
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
    signOut: "/logout",
  },
  trustHost: true,
  debug: process.env.NODE_ENV !== "production",
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
