import connectMongo from '../../../utils/dbConnect'
import Post from '../../../models/post.model'

export default async function handler(req, res) {
    
    if (req.method === 'GET') {

        try {
            await connectMongo();
            const postList = await Post.find()
                .populate({ path: 'created_user_id', model: 'User', select: 'name type _id' })
                .sort({ created_at: -1 })
                let list = await postList.filter((e, index)=> {
                    return (e.status == 1 || e.created_user_id._id == req.query.id)
                })
            res.status(200).json({ success: true, message: 'Your action is Successed.', query: list })
        } catch (error) {
            res.json({ error })
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
}