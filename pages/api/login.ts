import connectMongo from '../../utils/dbConnect'
import User from '../../models/user.model'
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from "next-connect";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import Token from 'models/token.model';
import { addDays } from 'date-fns';
import corsMiddleware from 'middleware/corsMiddleware';
const KEY = typeof process.env.JWT_KEY === "string" ? process.env.JWT_KEY : "4TtdxkvaOb2l70nqONHh6CV7+hsfIgEDCGfZZpFXtE4="

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
    let request = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    try {
        await connectMongo();
        let password: any = request.password
        let user = await User.findOne({ email: request.email }).select('+password')

        if (!user) {
            res
                .status(400)
                .json({ status: 'error', error: 'User Not Found' })
        } else {
            if (!user.is_deleted) {
                const userId = user._id,
                    userEmail = user.email,
                    userPassword = user.password,
                    userType = user.type,
                    userCreated = user.createdAt
                let result = await bcrypt.compare(password, userPassword)
                if (result) {
                    const payload = {
                        id: userId,
                        email: userEmail,
                        type: userType,
                        createdAt: userCreated
                    }
                    jwt.sign(
                        payload, KEY, { expiresIn: 2630000 },
                        (err, token) => {
                            const filter = { user_id: userId }
                            const token_data = {
                                user_id: userId,
                                token: token,
                                created_at: Date.now(),
                                expired_at: addDays(new Date(Date.now()), 30),
                                valid: true
                            }
                            Token.findOne(filter)
                            .populate({ path: 'user_id', model: User, select: 'name type -_id' })
                            .then((data) => {
                                if (data) {
                                    Token.findOneAndUpdate(filter, token_data, {
                                        new: true,
                                        upsert: true
                                    }).then((findData) => {                                        
                                        res.status(200).json({
                                            status: 'success',
                                            name: user.name,
                                            type: user.type,
                                            profile: user.profile,
                                            token: token,
                                            expired_at: data.expired_at
                                        })
                                    })
                                } else {
                                    Token.create(token_data).then((data) => {
                                        res.status(200).json({
                                            status: 'success',
                                            name: user.name,
                                            type: user.type,
                                            profile: user.profile,
                                            token: token,
                                            expired_at: data.expired_at
                                        })
                                    })
                                }
                            })
                        }
                    )
                } else {
                    res.status(400).send({ status: "fail", message: "Email or Password is incorrect." })
                }
            } else {
                res
                    .status(400)
                    .json({ status: 'error', error: 'User is deleted.' })
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
})
export default handler