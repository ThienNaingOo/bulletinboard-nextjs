import connectMongo from '../../../utils/dbConnect'
import Post from '../../../models/post.model'
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
                    if (request.hasOwnProperty('post_id')) {
                        const filter = { _id: request.post_id };
                        const update = { status: 0, deleted_user_id: data.user_id, deleted_at: Date.now() };

                        Post.findOne(filter).select('status created_user_id')
                            .then((post) => {                                
                                if (post) {
                                    if (post.status == '0') {
                                        res.status(200).json({ success: false, message: 'Your post is already deleted.' })
                                    } else if (post.created_user_id.equals(data.user_id)) {
                                        Post.findOneAndUpdate(filter, update, {
                                            new: true,
                                            upsert: true
                                        }).then((data) => {
                                            res.status(200).json({ success: true, message: 'Your post is Successfully deleted.' })
                                        })
                                    } else {
                                        res.status(401).send({ status: 'error', message: 'Unauthorized to delete this post.' })
                                    }
                                } else res.status(401).send({ status: 'error', message: 'Unauthorized' })
                            })
                    } else {
                        res.status(400).send({ status: 'error', message: 'Missing some parameters.' })
                    }
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

export default handler