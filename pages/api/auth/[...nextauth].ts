import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';
import connectMongo from '../../../utils/dbConnect'
import User from '../../../models/user.model'
import bcrypt from "bcrypt";
import Users from '../../../models/user.model';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credential) {
        // let saltWorkFactor = parseInt(process.env.SALT_WORK_FACTOR || "10") as number;
        await connectMongo();
        console.log("DATABASE CONNECTED", credential?.password);
        let password: any = credential?.password
        let user;
        try {
          user = await User.findOne({ email: credential?.email });
        } catch (error) {
          console.log(error);
          return Promise.resolve(null)
        }
        let result = await bcrypt.compare(password, user.password)
        return Promise.resolve(result ? user : null)
      }
    })],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    session: async ({ session, user, token }: any) => {

      if (session?.user) {
        session.user.id = token.sub;
        await connectMongo();
        try {
          const user = await Users.findOne({ _id: token.sub })
          session.user.type = user.type
        } catch (error) {
        }
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  secret: "4TtdxkvaOb2l70nqONHh6CV7+hsfIgEDCGfZZpFXtE4=",

})