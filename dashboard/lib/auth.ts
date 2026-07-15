import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session as any).accessToken = token.accessToken;
        (session as any).userId = token.id;
      }
      return session;
    },
  },
});
