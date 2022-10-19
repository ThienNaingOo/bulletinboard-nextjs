import connectMongo from '../../../utils/dbConnect'
import Post from '../../../models/post.model'
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from "next-connect";
import Token from 'models/token.model';
import * as csv from "fast-csv";
import { format } from 'date-fns';
import User from 'models/user.model';

const csvMaker = (postList: any, res: NextApiResponse) => {
    const rows = [["Title", "Description", "Posted User", "Posted Date"]];
    if (postList.length > 0) {
        postList.forEach((post) => {
            rows.push([
                post.title,
                post.description,
                post.postedBy.name,
                format(new Date(post.created_at), 'MM/dd/yyyy')
            ])
        })
        csv.writeToBuffer(rows).then((data) => {            
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.setHeader("Content-Disposition", "attachment; filename=bulletinboard_posts.csv; application/vnd.ms-excel");
            res.setHeader("Content-Length", data.length);
            return res.end(data);
        });
    } else res.status(401).send({ status: 'error', message: 'not found' })
}

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
        let token: any = req.headers['authorization'];
        await connectMongo();
        if (token) {
            let tk = token.split(" ")[1];
            const filter = { token: tk }
            Token.findOne(filter).then((data) => {
                if (data) {
                    let filterQuery: any = {
                        $or: [
                            { status: { $regex: ".*" + 1 + ".*", $options: "i" } },
                            { created_user_id: data.user_id },
                        ],
                    };
                    Post.find()
                        .select('title description status created_user_id created_at')
                        .populate({ path: 'postedBy', model: User, select: 'name -_id' })
                        .where(filterQuery)
                        .sort({ created_at: -1 })
                        .then((postList) => {
                            csvMaker(postList, res)
                        })
                } else {
                    res.status(401).send({ status: 'error', message: 'Unauthorized' })
                }
            })
        } else {
            Post.find()
                .select('title description status created_user_id created_at')
                .populate({ path: 'postedBy', model: User, select: 'name -_id' })
                .where({ status: 1 })
                .sort({ created_at: -1 })
                .then((postList) => csvMaker(postList, res))
        }
    } catch (e: any) {
        res.status(400).send({ status: 'error', message: e.message, error: e.name })
    }
})

export default handler;