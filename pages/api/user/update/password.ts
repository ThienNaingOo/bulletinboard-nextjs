import connectMongo from '../../../../utils/dbConnect'
import User from '../../../../models/user.model'
import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import Token from 'models/token.model';
import corsMiddleware from 'middleware/corsMiddleware';
import { IncomingForm } from 'formidable'

export const config = {
    api: {
        bodyParser: false
    }
};

// export default async function handler(req, res) {

//     let saltWorkFactor = parseInt("10") as number;
//     let salt = await bcrypt.genSalt(saltWorkFactor);

//     if (req.method === 'POST') {
//         try {
//             await connectMongo();
//             let hashedPassword = await bcrypt.hash(req.body.newpassword, salt);
//             const filter = { _id: req.body.id }
//             const update = { password: hashedPassword };
//             const user = await User.findOne({ id: req.body.id })
//             let result = await bcrypt.compare(req.body.oldpassword, user.password)
//             if (result) {
//                 const pwdUpdate = await User.findOneAndUpdate(filter, update, {
//                     new: true,
//                     upsert: true
//                 })
//                 res.status(200).json({ success: true, message: 'Your action is Successed.', data: pwdUpdate })
//             } else res.status(403).json({success: false, message: 'password is not match'})
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
            const filter = { token: tk };
            let saltWorkFactor = parseInt("10") as number;
            bcrypt.genSalt(saltWorkFactor).then((salt) => {
                Token.findOne(filter).then((data) => {
                    console.log(data);
                    if (data) {
                        const form = new IncomingForm();
                        form.parse(req, async function (err, fields, files) {
                            const updateFilter = { _id: data.user_id }
                            console.log(fields);
                            
                            if (fields.old_password && fields.new_password) {
                                User.findOne(updateFilter).select('+password').then((userData) => {
                                    console.log(userData);
                                    
                                    if (userData) {
                                        bcrypt.hash(fields.new_password, salt).then((hashPassword) => {
                                            const update = {
                                                password: hashPassword,
                                            }
                                            bcrypt.compare(fields.old_password, userData.password).then((result) => {
                                                if (result) {
                                                    User.findOneAndUpdate(updateFilter, update, {
                                                        new: true,
                                                        upsert: true
                                                    }).then((data) => {
                                                        console.log(data);
                                                        
                                                        res.status(200).json({ status: "success", message: 'Your password is successfully updated.'})
                                                    })
                                                } else res.status(403).json({ success: false, message: 'password is not match' })
                                            })
                                        })
                                    } else res.status(428).send({ status: 'error', message: "Required some fields." })
                                })
                            } else res.status(428).send({ status: 'error', message: "Required some fields." })
                        })
                    } else res.status(401).send({ status: 'error', message: 'Unauthorized' })
                })

            })
        } else res.status(401).send({ status: 'error', message: 'Unauthorized' })
    } catch (e: any) {
        res.status(400).send({ status: 'error', message: e.message, error: e.name })
    }
})

export default handler
