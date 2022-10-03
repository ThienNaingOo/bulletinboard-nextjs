import connectMongo from '../../../../utils/dbConnect'
import User from '../../../../models/user.model'
import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import Token from 'models/token.model';
import corsMiddleware from 'middleware/corsMiddleware';

export const config = {
    api: {
        bodyParser: false
    }
};

const saveFile = async (file, oldProfile) => {
    if (file) {
        if (oldProfile) {
            // const data = await fs.readFile(`./public${file}`);
            // fs.writeFile(`./public/profile/${oldProfile}`, data);
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

// export default async function handler(req, res) {
//     if (req.method === 'POST') {
//         try {
//             await connectMongo();
//             const form = new IncomingForm();
//             await form.parse(req, async function (err, fields, files) {
//                 //await saveFile(fields.file,fields.filename);
//                 const profile = (fields.is_profileupdate === 'false')? fields.profile: await saveFile(fields.file,fields.filename);
//                 const filter = { _id: fields.id }
//                 const update = {
//                     name: fields.name,
//                     email: fields.email,
//                     profile: profile,
//                     type: fields.type,
//                     phone: fields.phone,
//                     dob: new Date(fields.dob),
//                     address: fields.address,
//                     updated_user_id: fields.updated_user_id,
//                     updatedAt: new Date().toDateString()
//                 }
//                 const user = await User.findOneAndUpdate(filter, update, {
//                     new: true,
//                     upsert: true
//                 })
//                 res.status(200).json({ message: 'Your action is Successed.', data: user })
//             });

//         } catch (error) {
//             res.json({ error })
//         }
//     } else {
//         res.status(422).send('req_method_not_supported');
//     }
// }

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
                                const updateFilter = { _id: fields.id }
                                User.findOne(updateFilter).then((userData) => {
                                    console.log(fields);
                                    
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
                                            res.status(200).json({ status: "success", message: 'Your action is Successed.', data: data })
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
                                                res.status(200).json({ status: "success", message: 'Your action is Successed.', data: data })
                                            })
                                        })

                                    }

                                })
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