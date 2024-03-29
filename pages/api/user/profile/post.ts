import connectMongo from '../../../../utils/dbConnect'
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from "next-connect";
import Token from 'models/token.model';
import User from 'models/user.model';
import corsMiddleware from 'middleware/corsMiddleware';
import Post from 'models/post.model';

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
        let skip_count = page ? (page * limit) : 0;

        if (req.headers['authorization']) {
            let tk = token.split(" ")[1];
            const filter = { token: tk }
            Token.findOne(filter).then((data) => {
                if (data) {
                    if (req.query.key) {
                        let searchQuery: any = {
                            $or: [
                                { title: { $regex: ".*" + req.query.key + ".*", $options: "i" } },
                                { description: { $regex: ".*" + req.query.key + ".*", $options: "i" } },
                            ],
                        };
                        Post.find({ created_user_id: data.user_id }, {}, { skip: skip_count, limit: limit })
                            .populate({ path: 'postedBy', model: User, select: 'name type -_id' })
                            .select('title description status created_user_id')
                            .where(searchQuery)
                            .sort({ created_at: -1 })
                            .then((postList) => {
                                const posts = postList.map(postls => {
                                    return {
                                        id: postls._id,
                                        title: postls.title,
                                        description: postls.description,
                                        status: postls.status,
                                        posted_by: postls.postedBy,
                                        can_delete: true
                                    }
                                })
                                res.status(200).json({ status: 'success', message: 'Your action is Successed.', data: posts, current_page: page })
                            })
                    } else {
                        Post.find({ created_user_id: data.user_id }, {}, { skip: skip_count, limit: limit })
                            .populate({ path: 'postedBy', model: User, select: 'name type -_id' })
                            .select('title description status created_user_id')
                            .sort({ created_at: -1 })
                            .then((postList) => {
                                const posts = postList.map(postls => {
                                    return {
                                        id: postls._id,
                                        title: postls.title,
                                        description: postls.description,
                                        status: postls.status,
                                        posted_by: postls.postedBy,
                                        can_delete: true
                                    }
                                })
                                res.status(200).json({ status: 'success', message: 'Your action is Successed.', data: posts, current_page: page })
                            })
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

export default handler;