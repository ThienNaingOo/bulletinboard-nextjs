import connectMongo from '../../../utils/dbConnect'
import User from '../../../models/user.model'
import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import bcrypt from "bcrypt";

export const config = {
    api: {
        bodyParser: false
    }
};

const saveFile = async (file, filename) => {
    const data = await fs.readFile(`./public${file}`);
    fs.writeFile(`./public/profile/${filename}`, data);
    await fs.unlink(`./public${file}`);
    return "/profile/" + filename;
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
                const profile = await saveFile(fields.file,fields.filename);
                const data = {
                    name: fields.name,
                    email: fields.email,
                    password: hashedPassword,
                    profile: profile,
                    type: fields.type,
                    phone: fields.phone,
                    dob: new Date(fields.dob),
                    address: fields.address,
                    created_user_id: fields.created_user_id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toDateString()
                }                
                const user = await User.create(data)
                res.json({ user })
            });

        } catch (error) {
            res.json({ error })
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
}