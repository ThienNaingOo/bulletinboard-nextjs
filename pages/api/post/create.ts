import connectMongo from '../../../utils/dbConnect'
import Post from '../../../models/post.model'

export default async function handler(req, res) {

    if (req.method === 'POST') {
        try {
            await connectMongo();

            const post = await Post.create(req.body)
            res.json({ post })
        } catch (error) {
            res.json({ error })
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
}