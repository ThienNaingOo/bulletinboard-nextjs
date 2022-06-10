import connectMongo from '../../../utils/dbConnect'
import Post from '../../../models/post.model'

export default async function handler(req, res) {

    if (req.method === 'GET') {
        console.log(req.query);

        try {
            await connectMongo();
            const postList = await Post.find()
                .populate({ path: 'created_user_id', model: 'User', select: 'name type _id' })
                .sort({ created_at: -1 })
            let list = await postList.filter((e, index) => {
                return ((e.status == 1 || e.created_user_id._id == req.query.id) && (e.title.toLowerCase().includes(req.query.key.toLowerCase()) || e.description.toLowerCase().includes(req.query.key.toLowerCase()) || e.created_user_id.name.toLowerCase().includes(req.query.key.toLowerCase())))
            })
            list.length == 0 ? res.status(200).json({ success: false,count: list.length, message: 'Not Found.' })
            : res.status(200).json({ success: true,count: list.length, message: 'Your action is Successed.', data: list })
        } catch (error) {
            res.json({ error })
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
}