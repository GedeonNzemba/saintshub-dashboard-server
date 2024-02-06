// src/models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  avatar: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
});

export default mongoose.model<UserDocument>("User", UserSchema);
