import connectMongo from '../../../utils/dbConnect'
import User from '../../../models/user.model'
import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import Token from 'models/token.model';
import corsMiddleware from 'middleware/corsMiddleware';

export const config = {
    api: {
        bodyParser: false
    }
};

const saveFile = async (file) => {
    if (file) {
        const data = await fs.readFile(file.filepath + "");
        const filename = file.originalFilename + ""
        const finalFileName = filename.replace(/ /g, "-")
        fs.writeFile(`./public/profile/${finalFileName}`, data);
        await fs.unlink(file.filepath);
        return { path: "/profile/" + finalFileName, name: finalFileName };
    } else return { path: '', name: '' }
};

const handler = nextConnect({
    onError: (err, req, res: NextApiResponse, next) => {
        res.status(501).json({ message: `${err.message}` });
    },
    onNoMatch: (req, res) => {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    }
})
handler.use(corsMiddleware)
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
    let saltWorkFactor = parseInt("10") as number;
    let salt = await bcrypt.genSalt(saltWorkFactor);
    try {
        let token: any = req.headers['authorization'];
        await connectMongo();
        if (req.headers['authorization']) {
            let tk = token.split(" ")[1];
            const filter = { token: tk }
            Token.findOne(filter).then((data) => {
                if (data) {
                    User.findOne({ _id: data.user_id }).then((userfindone) => {
                        if (userfindone.type == 0) {
                            const form = new IncomingForm();
                            form.parse(req, async function (err, fields, files) {
                                let hashedPassword = await bcrypt.hash(fields.password, salt);
                                const profile = await saveFile(files.profile);
                                const data = {
                                    name: fields.name,
                                    email: fields.email,
                                    password: hashedPassword,
                                    profile: profile.path,
                                    type: fields.type,
                                    phone: fields.phone,
                                    dob: new Date(fields.dob),
                                    address: fields.address,
                                    created_user_id: fields.created_user_id,
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toDateString()
                                }
                                const user = await User.create(data)
                                res.status(200).json({ status: "success", message: 'Your action is Successed.', details: user })
                            });
                        } else res.status(401).send({ status: 'error', message: 'Unauthorized user Role' })
                    })
                } else {
                    res.status(401).send({ status: 'error', message: 'Unauthorized' })
                }
            })
        } else {
            res.status(401).send({ status: 'error', message: 'Unauthorized' })
        }
    } catch (e: any) {
        res.status(400).send({ status: 'error', message: e.message, error: e.name })
    }
})

export default handler