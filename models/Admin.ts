import mongoose, { Schema, model, models } from 'mongoose';

const WebAuthnCredentialSchema = new Schema({
    credentialID: { type: String, required: true },
    credentialPublicKey: { type: Buffer, required: true },
    counter: { type: Number, required: true },
    credentialDeviceType: { type: String, required: true },
    credentialBackedUp: { type: Boolean, required: true },
    transports: { type: [String] }
}, { _id: false });

const AdminSchema = new Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    currentChallenge: { type: String },
    credentials: [WebAuthnCredentialSchema],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true });

const Admin = models.Admin || model('Admin', AdminSchema);

export default Admin;
