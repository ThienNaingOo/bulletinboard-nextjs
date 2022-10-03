import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';
import connectMongo from '../../../utils/dbConnect'
import User from '../../../models/user.model'
import bcrypt from "bcrypt";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "***@***.***" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credential) {
        await connectMongo();
        let password: any = credential?.password
        let user;
        try {
          user = await User.findOne({ email: credential?.email }).select('+password');
          console.log(user);
          
        } catch (error) {
          return Promise.reject(new Error('Error in login process.'))
        }
        let result = await bcrypt.compare(password, user.password)
        return (result ? Promise.resolve(user) : Promise.reject(new Error('Error in login process.')))
      }
    })],
  pages: {
    signIn: '/',
    signOut: '/'
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    session: async ({ session, user, token }: any) => {
      if (session?.user) {
        await connectMongo();
        try {
          const user = await User.findOne({ _id: token.sub })
          session.user.id = user._id;
          session.user.type = user.type;
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