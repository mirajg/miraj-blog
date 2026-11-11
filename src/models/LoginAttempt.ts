import mongoose, { Schema, type Model } from "mongoose";

export interface LoginAttemptDocument {
    key: string; // the visitor's IP address
    count: number;
    expiresAt: Date;
}

const loginAttemptSchema = new Schema<LoginAttemptDocument>({
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
});

// MongoDB deletes the record automatically once expiresAt has passed
loginAttemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const LoginAttempt =
    (mongoose.models.LoginAttempt as Model<LoginAttemptDocument>) ||
    mongoose.model<LoginAttemptDocument>("LoginAttempt", loginAttemptSchema);

export default LoginAttempt;