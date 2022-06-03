import connectMongo from '../../../../utils/dbConnect'
import User from '../../../../models/user.model'
import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import bcrypt from "bcrypt";

export const config = {
    api: {
        bodyParser: false
    }
};

const saveFile = async (file) => {
    const data = await fs.readFile(file.filepath + "");
    fs.writeFile(`./public/${file.originalFilename}`, data);
    await fs.unlink(file.filepath);
    return "/" + file.originalFilename;
};


export default async function handler(req, res) {

    let saltWorkFactor = parseInt("10") as number;
    let salt = await bcrypt.genSalt(saltWorkFactor);

    if (req.method === 'POST') {
        try {
            await connectMongo();
            const form = new IncomingForm();
            await form.parse(req, async function (err, fields, files) {
                let hashedPassword = await bcrypt.hash(fields.password, salt);
                const profile = await saveFile(files.file);
                const filter = { _id: fields.id }
                const update = {
                    name: fields.name,
                    email: fields.email,
                    password: hashedPassword,
                    profile: profile,
                    type: fields.type,
                    phone: fields.phone,
                    dob: new Date(fields.dob),
                    address: fields.address,
                    updated_user_id: fields.updated_user_id,
                    updatedAt: new Date().toDateString()
                }
                const user = await User.findOneAndUpdate(filter, update, {
                    new: true,
                    upsert: true
                })
                res.status(200).json({ message: 'Your action is Successed.', query: user })
            });

        } catch (error) {
            res.json({ error })
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
}