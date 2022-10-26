import connectMongo from '../../../utils/dbConnect'
import User from '../../../models/user.model'
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import Token from 'models/token.model';
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
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let token: any = req.headers['authorization'];
        await connectMongo();
        if (req.headers['authorization']) {
            let tk = token.split(" ")[1];
            const filter = { token: tk }
            Token.findOne(filter).then((data) => {
                if (data) {
                    let request = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
                    if (request.hasOwnProperty('user_id')) {
                        User.findOne({ _id: data.user_id }).then((userfindone) => {
                            if (userfindone.type == 0) {
                                const filter = { _id: request.user_id }; // deleted user ID
                                const update = { is_deleted: true, deleted_user_id: data.user_id, deleted_at: Date.now() };
                                User.findOneAndUpdate(filter, update, {
                                    new: true,
                                    upsert: true
                                }).then((returnData) => {

                                    res.status(200).json({ status: "success", message: 'Successfully deleted.', data: returnData })
                                })
                            } else res.status(401).send({ status: 'error', message: 'Unauthorized user Role.' })
                        })
                    } else res.status(400).send({ status: 'error', message: 'Missing some parameters.' })

                } else res.status(401).send({ status: 'error', message: 'Unauthorized' })
            });
        } else res.status(401).send({ status: 'error', message: 'Unauthorized' })
    } catch (e: any) {
        res.status(400).send({ status: 'error', message: e.message, error: e.name })
    }
})
handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await connectMongo();
        let request = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        if (request.id && request.deleted_user_id) {
            User.findOne({ _id: request.id }).then((userfindone) => {
                if (userfindone.type == 0) {
                    const filter = { _id: request.id }; // deleted user ID
                    const update = { is_deleted: true, deleted_user_id: request.deleted_user_id, deleted_at: Date.now() };
                    User.findOneAndUpdate(filter, update, {
                        new: true,
                        upsert: true
                    }).then((returnData) => {

                        res.status(200).json({ status: "success", message: 'Successfully deleted.', data: returnData })
                    })
                } else res.status(401).send({ status: 'error', message: 'Unauthorized user Role.' })
            })
        } else res.status(400).send({ status: 'error', message: 'Missing some parameters.' })
    } catch (e: any) {
        res.status(400).send({ status: 'error', message: e.message, error: e.name })
    }
})

export default handler