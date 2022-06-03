import connectMongo from '../../../../utils/dbConnect'
import User from '../../../../models/user.model'
import bcrypt from "bcrypt";

export default async function handler(req, res) {

    let saltWorkFactor = parseInt("10") as number;
    let salt = await bcrypt.genSalt(saltWorkFactor);

    if (req.method === 'POST') {
        try {
            await connectMongo();
            let hashedPassword = await bcrypt.hash(req.body.newpassword, salt);
            const filter = { _id: req.body.id }
            const update = { password: hashedPassword };
            const user = await User.findOne({ id: req.body.id })
            let result = await bcrypt.compare(req.body.oldpassword, user.password)
            if (result) {
                const pwdUpdate = await User.findOneAndUpdate(filter, update, {
                    new: true,
                    upsert: true
                })
                res.status(200).json({ success: true, message: 'Your action is Successed.', query: pwdUpdate })
            } else res.status(403).json({success: false, message: 'password is not match'})
        } catch (error) {
            res.json({ error })
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
}