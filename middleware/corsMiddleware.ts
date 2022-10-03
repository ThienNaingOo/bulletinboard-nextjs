import nextConnect from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

const corsMiddleware = nextConnect();

corsMiddleware.use(async (req: NextApiRequest, res: NextApiResponse, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', "Access-Control-Allow-Headers , X-Requested-With, Content-Type, Authorization");
  // res.setHeader('Access-Control-Allow-Credentials', 'false');
  // res.setHeader('Cache-Control', "no-cache, no-store, must-revalidate");
  // res.setHeader("Content-Type", "application/json")
  // res.setHeader("Access-Control-Request-Method","OPTIONS")
  // res.setHeader("Access-Control-Request-Headers","Content-Type, Authorization")
  return next();
});
corsMiddleware.options(async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send("ok")
})

export default corsMiddleware;