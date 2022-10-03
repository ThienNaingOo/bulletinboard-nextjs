// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import Cors from 'cors';
// import initMiddleware from "lib/init-middleware"

// const cors = initMiddleware(
//   Cors({
//     origin: "*",
//     methods: ["GET"]
//   })
// )
export default async function handler(req, res) {
  // await cors(req,res)
  res.status(200).json({ name: 'John Doe' })
}
