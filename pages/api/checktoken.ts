import connectMongo from '../../utils/dbConnect'
import jwt from 'jsonwebtoken';
import Token from 'models/token.model';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from "next-connect";

const KEY = typeof process.env.JWT_KEY === "string" ? process.env.JWT_KEY : "4TtdxkvaOb2l70nqONHh6CV7+hsfIgEDCGfZZpFXtE4="

const handler = nextConnect({
    onError: (err, req, res: NextApiResponse, next) => {
        res.status(501).json({ message: `${err.message}` });
    },
    onNoMatch: (req, res) => {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    }
})

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let token: any = req.headers['authorization'];
        if (req.headers['authorization']) {
            let tk = token.split(" ")[1]
            const user_data: any = jwt.verify(tk, KEY)
            const filter = { user_id: user_data.user_id }
            await connectMongo()
            Token.findOne(filter).then((data) => {                
                if (data && data.token === tk) {
                    res.status(200).json({
                        status: 'success',
                        data: data
                    })
                } else res.status(401).send({ status: 'error', message: 'Unauthorized' })
            })
        } else res.status(401).send({ status: 'error', message: 'Unauthorized' });
    } catch (e: any) {
        res.status(400).send({ status: 'error', message: e.message, error: e.name })
    }
});

export default handler