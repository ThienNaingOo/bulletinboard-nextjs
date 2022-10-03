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
                    if (data) {
                        const form = new IncomingForm();
                        form.parse(req, async function (err, fields, files) {
                            const updateFilter = { _id: data.user_id }
                            
                            if (fields.old_password && fields.new_password) {
                                User.findOne(updateFilter).select('+password').then((userData) => {
                                    
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
