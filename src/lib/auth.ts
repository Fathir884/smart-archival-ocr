import GoogleProvider from "next-auth/providers/google";
import { type NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    scope: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid",
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                },
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            // Pass the access token to the client if needed (be careful with security)
            // For this app, we might need it server-side to call Sheets API.
            // We will store it in the session object for simplicity in this prototype.
            if (session) {
                (session as any).accessToken = token.accessToken;
            }
            return session;
        },
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
    },
};
