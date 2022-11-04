import connectMongo from '../../../utils/dbConnect'
import Post from '../../../models/post.model'
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from "next-connect";
import Token from 'models/token.model';
import User from 'models/user.model';
import corsMiddleware from 'middleware/corsMiddleware';
import { format } from 'date-fns';

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

        if (token) {
            let tk = token.split(" ")[1];
            const filter = { token: tk }
            let searchQuery: any;
            if (req.query.key) {
                searchQuery = {
                    $and: [
                        {
                            $or: [
                                { title: { $regex: ".*" + req.query.key + ".*", $options: "i" } },
                                { description: { $regex: ".*" + req.query.key + ".*", $options: "i" } },
                            ]
                        },
                        { status: { $regex: ".*" + 1 + ".*", $options: "i" } }
                    ]
                };
            } else searchQuery = { status: 1 }
            Token.findOne(filter).then((data) => {
                if (data) {
                    Post.find({}, {}, { skip: skip_count, limit: limit })
                        .where(searchQuery)
                        .select('title description status created_user_id created_at')
                        .populate({ path: 'postedBy', model: User, select: 'name type -_id' })
                        .sort({ created_at: -1 })
                        .then((postList) => {
                            const posts = postList.map(postls => {
                                if (postls.created_user_id.equals(data.user_id)) {
                                    return {
                                        id: postls._id,
                                        title: postls.title,
                                        description: postls.description,
                                        status: postls.status,
                                        posted_by: postls.postedBy,
                                        posted_date: format(new Date(postls.created_at), 'MM/dd/yyyy'),
                                        can_delete: true,
                                    }
                                } else return {
                                    id: postls._id,
                                    title: postls.title,
                                    description: postls.description,
                                    status: postls.status,
                                    posted_by: postls.postedBy,
                                    posted_date: format(new Date(postls.created_at), 'MM/dd/yyyy'),
                                    can_delete: false,
                                }
                            })
                            res.status(200).json({ status: 'success', message: 'Your action is Successed.', data: posts, current_page: page })
                        })
                } else {
                    res.status(401).send({ status: 'error', message: 'Unauthorized' })
                }
            })
        } else if (req.query.id) {
            let filterQuery: any = {
                $or: [
                    { status: { $regex: ".*" + 1 + ".*", $options: "i" } },
                    { created_user_id: req.query.id },
                ],
            };
            Post.find()
                .select('title description status created_user_id created_at')
                .where(filterQuery)
                .populate({ path: 'postedBy', model: User, select: 'name type -_id' })
                .sort({ created_at: -1 })
                .then((postList) => {
                    res.status(200).json({ status: 'success', message: 'Your action is Successed..', data: postList, current_page: page })
                })
        } else res.status(400).send({ status: 'error', message: "Error::" })
    } catch (e: any) {
        res.status(400).send({ status: 'error', message: e.message, error: e.name })
    }
})

export default handler;