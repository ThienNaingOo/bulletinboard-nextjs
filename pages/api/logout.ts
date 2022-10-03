
import connectMongo from '../../utils/dbConnect'
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from "next-connect";
import corsMiddleware from 'middleware/corsMiddleware';
import Token from 'models/token.model';
import jwt from 'jsonwebtoken';

const KEY = typeof process.env.JWT_KEY === "string" ? process.env.JWT_KEY : "4TtdxkvaOb2l70nqONHh6CV7+hsfIgEDCGfZZpFXtE4="

const handler = nextConnect({
    onError: (err, req, res: NextApiResponse, next) => {
        res.status(501).json({ message: `${err.message}` });
    },
    onNoMatch: (req, res) => {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    }
})
handler.use(corsMiddleware)
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let token: any = req.headers['authorization'];
        if (req.headers['authorization']) {
            let tk = token.split(" ")[1]
            const user_data: any = jwt.verify(tk, KEY)
            const filter = { user_id: user_data.id }
            const update = {
                token: '',
                created_at: Date.now(),
                expired_at: new Date(Date.now()),
                valid: false
            }
            await connectMongo()
            Token.findOneAndUpdate(filter,update).then((data)=> {
                if(data) {
                res.status(200).send({ status: 'success', message: 'successfully logout.' })
                } else res.status(500).send('Can\'t Logout.')
            })
        } else res.status(401).send({ status: 'error', message: 'Unauthorized' });
    } catch (error) {
        res.status(500).send(error);
    }
})
export default handler