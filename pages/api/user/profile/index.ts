import connectMongo from '../../../../utils/dbConnect'
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from "next-connect";
import Token from 'models/token.model';
import User from 'models/user.model';
import corsMiddleware from 'middleware/corsMiddleware';
import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'

export const config = {
    api: {
        bodyParser: false
    }
};

const saveFile = async (file, oldProfile) => {
    if (file) {
        if (oldProfile) {
            await fs.unlink(`./public${oldProfile}`);
        }
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
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let token: any = req.headers['authorization'];
        await connectMongo();
        if (req.headers['authorization']) {
            let tk = token.split(" ")[1];
            const filter = { token: tk }
            Token.findOne(filter).then((data) => {
                if (data) {
                    User.findOne({ _id: data.user_id })
                        .select('name email phone dob profile address')
                        .then((userfindone) => {
                            res.status(200).json({ success: true, data: userfindone })
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
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let token: any = req.headers['authorization'];
        await connectMongo();
        if (req.headers['authorization']) {
            let tk = token.split(" ")[1];
            const filter = { token: tk }
            Token.findOne(filter).then((data) => {
                if (data) {
                    const form = new IncomingForm();
                    form.parse(req, async function (err, fields, files) {
                        const updateFilter = { _id: fields.id }
                        if (fields.name && fields.email && fields.phone) {
                            User.findOne(updateFilter).then((userData) => {
                                if ((fields.old_profile && fields.old_profile !== null && fields.old_profile !== "") || !files.profile) {
                                    const update = {
                                        name: fields.name,
                                        email: fields.email,
                                        type: fields.type,
                                        phone: fields.phone,
                                        dob: new Date(fields.dob),
                                        address: fields.address,
                                        updated_user_id: fields.updated_user_id,
                                        updatedAt: new Date().toDateString()
                                    }
                                    User.findOneAndUpdate(updateFilter, update, {
                                        new: true,
                                        upsert: true
                                    }).then((data) => {
                                        res.status(200).json({ status: 'success', message: 'Your action is Successed.', data: data })
                                    })
                                } else {
                                    saveFile(files.profile, userData.profile).then((filereturn) => {
                                        const update = {
                                            name: fields.name,
                                            email: fields.email,
                                            profile: filereturn.path,
                                            type: fields.type,
                                            phone: fields.phone,
                                            dob: new Date(fields.dob),
                                            address: fields.address,
                                            updated_user_id: fields.updated_user_id,
                                            updatedAt: new Date().toDateString()
                                        }
                                        User.findOneAndUpdate(updateFilter, update, {
                                            new: true,
                                            upsert: true
                                        }).then((data) => {
                                            res.status(200).json({ status: 'success', message: 'Your action is Successed.', data: data })
                                        })
                                    })

                                }
                            })
                        }
                    })
                } else res.status(401).send({ status: 'error', message: 'Unauthorized' })
            })
        } else res.status(401).send({ status: 'error', message: 'Unauthorized' })
    } catch (e: any) {
        res.status(400).send({ status: 'error', message: e.message, error: e.name })
    }
})

export default handler;