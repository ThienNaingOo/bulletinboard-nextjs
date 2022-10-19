import connectMongo from '../../../utils/dbConnect'
import Post from '../../../models/post.model'
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import Token from 'models/token.model';
import corsMiddleware from 'middleware/corsMiddleware';
import { updatePostSchema } from 'schemas/post.schemas';

const handler = nextConnect({
    onError: (err, req, res: NextApiResponse, next) => {
        res.status(501).json({ message: `${err.message}` });
    },
    onNoMatch: (req, res) => {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    }
})
handler.use(corsMiddleware)
handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
    let request = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    try {
        let token: any = req.headers['authorization'];
        await connectMongo();
        await updatePostSchema.validate(request, { abortEarly: false })
            .catch((err) => {
                res.status(400).send({ status: 'error', message: err.name, error: err.errors })
            })
            .then(async (valid) => {
                if (valid) {
                    if (req.headers['authorization']) {
                        let tk = token.split(" ")[1];
                        const filter = { token: tk }
                        Token.findOne(filter).then((data) => {
                            if (data) {
                                const filter = { _id: request.post_id }
                                let update_data = {
                                    title: request.title,
                                    description: request.description,
                                    status: request.status,
                                    updated_user_id: data.user_id,
                                    updated_at: Date.now()
                                }
                                Post.findOneAndUpdate(filter, update_data, {
                                    new: true,
                                    upsert: true
                                }).then((post) => {
                                    res.status(200).json({ status: 'success', message: 'Your action is Successed.', data: post })
                                })
                            } else {
                                res.status(401).send({ status: 'error', message: 'Unauthorized' })
                            }
                        })
                    } else if (request.updated_user_id) {
                        const filter = { _id: request.post_id }
                        let update_data = {
                            title: request.title,
                            description: request.description,
                            status: request.status,
                            updated_user_id: request.updated_user_id,
                            updated_at: Date.now()
                        }
                        Post.findOneAndUpdate(filter, update_data, {
                            new: true,
                            upsert: true
                        }).then((post) => {
                            res.status(200).json({ status: 'success', message: 'Your action is Successed.', data: post })
                        })
                    } else {
                        res.status(401).send({ status: 'error', message: 'Unauthorized' })
                    }
                }
            })
    } catch (e: any) {
        res.status(400).send({ status: 'error', message: e.message, error: e.name })
    }
})

export default handler