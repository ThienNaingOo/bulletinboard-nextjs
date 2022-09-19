import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from "next-connect";
import connectMongo from '../../../utils/dbConnect'
import Post from '../../../models/post.model'
import Token from 'models/token.model';
import User from 'models/user.model';

// export default async function handler(req, res) {

//     if (req.method === 'GET') {
//         try {
//             await connectMongo();
//             let searchQuery: any = {
//                 $or: [
//                     { title: { $regex: ".*" + req.query.key + ".*", $options: "i" } },
//                     { description: { $regex: ".*" + req.query.key + ".*", $options: "i" } },
//                 ],
//             };
//             const postList = await Post.find()
//                 .where(searchQuery)
//                 .populate({ path: 'created_user_id', model: 'User', select: 'name type _id' })
//                 .sort({ created_at: -1 })
//             let list = await postList.filter((e, index) => {
//                 return ((e.status == 1 || e.created_user_id._id == req.query.id))
//             })
//             list.length == 0 ? res.status(200).json({ success: false, count: list.length, message: 'Not Found.' })
//                 : res.status(200).json({ success: true, count: list.length, message: 'Your action is Successed.', data: list })
//         } catch (error) {
//             res.json({ error })
//         }
//     } else {
//         res.status(422).send('req_method_not_supported');
//     }
// }

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
        await connectMongo();
        let limit = 10; let page: any = req.query.page ? req.query.page : 0;
        let skip_count = req.query.page ? (page * limit) : 0;
        let searchQuery: any = {
            $or: [
                { title: { $regex: ".*" + req.query.key + ".*", $options: "i" } },
                { description: { $regex: ".*" + req.query.key + ".*", $options: "i" } },
            ],
        };

        if (req.headers['authorization']) {
            let tk = token.split(" ")[1];
            const filter = { token: tk }
            Token.findOne(filter).then((data) => {
                if (data) {
                    Post.find({}, {}, { skip: skip_count, limit: limit })
                        .where(searchQuery)
                        .select('title description status created_user_id')
                        .populate({ path: 'postedBy', model: User, select: 'name type -_id' })
                        .sort({ created_at: -1 })
                        .then((postList) => {
                            let list = postList.filter((e, index) => {
                                return (data) ? (e.status == 1 || e.created_user_id._id == req.query.id) : (e.status == 1)
                            });
                            res.status(200).json({ success: true, message: 'Your action is Successed.', query: list })
                        })
                } else {
                    res.status(401).send({ status: 'error', message: 'Unauthorized' })
                }
            })
        } else {
            Post.find({}, {}, { skip: skip_count, limit: limit })
                .where(searchQuery)
                .select('title description status created_user_id')
                .where({ status: 1 })
                .populate({ path: 'postedBy', model: User, select: 'name type -_id' })
                .sort({ created_at: -1 })
                .then((postList) => {
                    res.status(200).json({ success: true, message: 'Your action is Successed.', query: postList })
                })
        }
    } catch (e: any) {
        res.status(400).send({ status: 'error', message: e.message, error: e.name })
    }
})

export default handler;