import connectMongo from '../../../../utils/dbConnect'
import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import * as Papa from 'papaparse';
import Post from 'models/post.model';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import Token from 'models/token.model';
import corsMiddleware from 'middleware/corsMiddleware';
import User from 'models/user.model';

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
        var counter = 0
        await connectMongo();
        let token: any = req.headers['authorization'];
        const form = new IncomingForm();
        form.parse(req, async function (err, fields, files) {
            if (req.headers['authorization']) {
                let tk = token.split(" ")[1];
                const filter = { token: tk }
                Token.findOne(filter).then((token_data) => {
                    if (token_data) {
                        if (files.data_file) {
                            fs.readFile(files?.data_file?.filepath + "", 'utf8').then((data) => {
                                Papa.parse(data, {
                                    step: function (row) {
                                        if (row.data[0] !== 'title' && row.data[0] !== '') {
                                            let data = {
                                                title: row.data[0],
                                                description: row.data[1],
                                                created_user_id: token_data.user_id,
                                            }
                                            Post.create(data)
                                            counter++;
                                        }
                                    }
                                });
                            }).catch((error) => console.log(error)
                            )
                            res.status(200).json({ status: 'success', message: 'Added ' + counter + ' rows!' })
                        } else res.status(400).send({ status: 'error', message: 'Missing \'data_file\' parameters.' })

                    } else res.status(401).send({ status: 'error', message: 'Unauthorized' })
                });
            } else if (fields.id) {
                User.findOne({ _id: fields.id }).then((userfindone) => {
                    if (userfindone) {
                        fs.readFile(files?.data_file?.filepath + "", 'utf8').then((data) => {
                            Papa.parse(data, {
                                step: function (row) {
                                    if (row.data[0] !== 'title' && row.data[0] !== '') {
                                        let data = {
                                            title: row.data[0],
                                            description: row.data[1],
                                            created_user_id: fields.id,
                                        }
                                        Post.create(data).then((data) => {
                                            counter++;
                                        })
                                    }
                                }
                            });
                        }).catch((error) => console.log(error)
                        )
                        res.status(200).json({ status: 'success', message: 'Added ' + counter + ' rows!' })
                    } else res.status(401).send({ status: 'error', message: 'Unauthorized' })
                })
            } else res.status(401).send({ status: 'error', message: 'Unauthorized' })
        })
    } catch (error) {
        res.json({ error })
    }
});

export default handler