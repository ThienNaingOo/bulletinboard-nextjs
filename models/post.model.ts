import mongoose, { model, models } from "mongoose";

interface IPost {
    _id: any,
    title: string,
    description: string,
    status: string,
    created_at: Date,
    deleted_at: Date,
    updated_at: Date,
    created_user_id: mongoose.Schema.Types.ObjectId,
    updated_user_id: mongoose.Schema.Types.ObjectId,
    deleted_user_id: mongoose.Schema.Types.ObjectId,
}

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            max: 255,
        },
        description: {
            type: String,
            required: true,
            max: 255,
        },
        status: {
            type: String,
            max: 1,
            default: "1",
        },
        created_user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        updated_user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        deleted_user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        deleted_at: {
            type: Date,
            default: null,
        },
        created_at: {
            type: Date,
            default: Date.now()
        },
        updated_at: {
            type: Date,
            default: Date.now()
        }
    }
);

interface IPostDoc extends IPost, Document { }

postSchema.method({});

const Post = models.Post || model<IPostDoc>('Post', postSchema);

export default Post;