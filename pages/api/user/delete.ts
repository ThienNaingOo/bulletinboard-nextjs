import connectMongo from '../../../utils/dbConnect'
import User from '../../../models/user.model'

export default async function handler(req, res) {

    if (req.method === 'DELETE') {

        try {
            await connectMongo();
            const filter = { _id: req.body.user_id }
            const postUpdate = await User.findOneAndDelete(filter)
            res.status(200).json({ success: true, message: 'Your action is Successed.', query: postUpdate })
        } catch (error) {
            res.json({ error })
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
}