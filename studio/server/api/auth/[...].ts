import { CredentialsProvider } from "next-auth/providers/credentials";
import _CredentialsProvider from "next-auth/providers/credentials";
import { NuxtAuthHandler } from "#auth";

// @ts-expect-error
const CredentialsProvider = _CredentialsProvider.default as CredentialsProvider;
export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      authorize: async (credentials) => {
        const { username, password } = credentials || {};
        const prismaClient = usePrismaClient();
        const user = await prismaClient.user.findUnique({
          where: {
            name: username,
            password: cryptoPassword(password),
          },
        });
        if (user) {
          return {
            id: user.id.toString(),
            name: user.name,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        token.id = user ? user.id || "" : "";
      }
      return token;
    },
    session: async ({ session, token }) => {
      (session as any).uid = token.id;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
});
