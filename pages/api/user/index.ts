import connectMongo from '../../../utils/dbConnect'
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from "next-connect";
import Token from 'models/token.model';
import User from 'models/user.model';
import corsMiddleware from 'middleware/corsMiddleware';

const handler = nextConnect({
    onError: (err, req, res: NextApiResponse, next) => {
        res.status(501).json({ message: `${err.message}` });
    },
    onNoMatch: (req, res) => {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    }
})
handler.use(corsMiddleware)
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let token: any = req.headers['authorization'];
        await connectMongo();
        let limit = 10; let page: any = req.query.page ? req.query.page : 0;
        let skip_count = req.query.page ? (page * limit) : 0;
        if (req.headers['authorization']) {
            let tk = token.split(" ")[1];
            const filter = { token: tk }
            Token.findOne(filter).then((data) => {
                if (data) {
                    User.findOne({ _id: data.user_id }).then((userfindone) => {
                        if (userfindone.type == 0) {
                            User.find({}, {}, { skip: skip_count, limit: limit })
                                .select('name email phone dob created_user_id')
                                .populate({ path: 'created_user_id', model: User, select: 'name type -_id' })
                                .sort({ created_at: -1 })
                                .then((userList) => {
                                    res.status(200).json({ success: true, data: userList, current_page: page })
                                })
                        } else res.status(401).send({ status: 'error', message: 'Unauthorized user Role' })
                    })
                } else {
                    res.status(401).send({ status: 'error', message: 'Unauthorized' })
                }
            })
        } else {
            res.status(401).send({ status: 'error', message: 'Unauthorized' })
        }
    } catch (e: any) {
        res.status(400).send({ status: 'error', message: e.message, error: e.name })
    }
})

export default handler;