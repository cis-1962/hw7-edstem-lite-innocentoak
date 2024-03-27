import mongoose, { Schema, Document } from 'mongoose';

interface UserDocument extends Document {
    username: string;
    password: string;
}

const userSchema = new Schema<UserDocument>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    timestamps: true
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
