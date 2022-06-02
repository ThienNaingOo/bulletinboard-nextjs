import connectMongo from '../../utils/dbConnect'
import User from '../../models/user.model'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await connectMongo();
            const user = await User.findOne(req.body)
            res.json({ user })
        } catch (error) {
            res.json({ error })
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
}