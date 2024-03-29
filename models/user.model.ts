import mongoose, { model, models } from "mongoose";

interface IUser {
    _id: any,
    name: string,
    email: string,
    password: string,
    profile: string,
    type:string,
    phone: string,
    address: string,
    dob: Date,
    created_at: Date,

}
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            max: 255,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 255,
            select: false,
        },
        profile: {
            type: String,
        },
        type: {
            type: String,
            max: 1,
            default: "1",
        },
        phone: {
            type: String,
            required: true,
            max: 20,
        },
        address: {
            type: String,
            max: 255,
        },
        dob: {
            type: Date,
        },
        created_user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        updated_user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        is_deleted: {
            type: Boolean,
            required: true,
            default: false,
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

userSchema.virtual('createdUser', {
    justOne: true,
    localField: 'created_user_id',
    foreignField: '_id',
    ref: 'User'
})
interface IUserDoc extends IUser, Document {}

userSchema.method({});

const User = models.User || model<IUserDoc>('User', userSchema);

export default User;