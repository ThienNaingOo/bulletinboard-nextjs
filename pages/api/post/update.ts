import connectMongo from '../../../utils/dbConnect'
import Post from '../../../models/post.model'

export default async function handler(req, res) {

    if (req.method === 'PUT') {
        try {
            await connectMongo();
            const filter = { _id: req.body.post_id }
            const update = { status: 0, deleted_user_id: req.body.user_id, deleted_at: Date.now() };
            const postUpdate = await Post.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true
            })
            res.status(200).json({ message: 'Your action is Successed.', query: postUpdate })
        } catch (error) {
            res.json({ error })
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
}