import mongoose, { model, models } from "mongoose";

interface IToken {
    _id: any,
    token: string,
    valid: Boolean,
    user_id: mongoose.Schema.Types.ObjectId
    created_at: Date,
    expired_at: Date,
}

const tokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
        },
        valid: {
            type: Boolean,
            required: true,
            default: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        created_at: {
            type: Date,
            default: Date.now()
        },
        expired_at: {
            type: Date,
            required: true
        }
    }
);

interface ITokenDoc extends IToken, Document { }

tokenSchema.method({});

const Token = models.Token || model<ITokenDoc>('Token', tokenSchema);

export default Token;