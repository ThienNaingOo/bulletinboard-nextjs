import connectMongo from '../../../utils/dbConnect'
import Post from '../../../models/post.model'
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from "next-connect";
import Token from 'models/token.model';
  
const handler = nextConnect({
    onError: (err, req, res: NextApiResponse, next) => {
        res.status(501).json({ message: `${err.message}` });
    },
    onNoMatch: (req, res) => {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    }
})
// handler.use(corsMiddleware)
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let token: any = req.headers?.authorization;
        await connectMongo();
        if (req.headers.authorization) {
            let tk = token.split(" ")[1];
            const filter = { token: tk }
            Token.findOne(filter).then((data)=> {
                    Post.find()
                        .populate({ path: 'created_user_id', model: 'User', select: 'name type _id' })
                        .sort({ created_at: -1 })
                        .then((postList)=> {
                            let list = postList.filter((e, index)=> {
                                return (data)?(e.status == 1 || e.created_user_id._id == req.query.id): (e.status == 1)
                            });
                            res.status(200).json({ success: true, message: 'Your action is Successed.', data: list }) 
                        })
            })
        } else {
            Post.find()
            .populate({ path: 'created_user_id', model: 'User', select: 'name type _id' })
            .sort({ created_at: -1 })
            .then((postList)=> {
                let list = postList.filter((e, index)=> {
                    return (e.status == 1)
                });
                res.status(200).json({ success: true, message: 'Your action is Successed.', data: list }) 
            })
        }
    } catch (e: any) {
        res.status(400).send({ status: 'error', message: e.message, error: e.name })
    }
})

export default handler;
// export default async function handler(req, res) {
    
//     if (req.method === 'GET') {

//         try {
//             await connectMongo();
//             const postList = await Post.find()
//                 .populate({ path: 'created_user_id', model: 'User', select: 'name type _id' })
//                 .sort({ created_at: -1 })
//                 let list = await postList.filter((e, index)=> {
//                     return (e.status == 1 || e.created_user_id._id == req.query.id)
//                 })
//             res.status(200).json({ success: true, message: 'Your action is Successed.', query: list })
//         } catch (error) {
//             res.json({ error })
//         }
//     } else {
//         res.status(422).send('req_method_not_supported');
//     }
// }