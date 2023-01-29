import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Please add an email"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please add a valid email",
            ]
        },
        password: {
            type: String,
            // required: [true, "Please add a password"],
            minlength: [6, "Password minimum length is 6 characters"],
        },
        firstName: String,
        lastName: String,
        bloodType: String,
        phone: {
            type: Number,
            // required: true,
        },
        imagePath: {
            type: String,
        },
        imageFilename: {
            type: String,
        },
        isSuspended: {
            type: Boolean,
            default: false
        },
        isClockIn : {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ['Online', 'Offline'],
            default: "Offline"
        },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin']
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    }
);

// assign jwt
UserSchema.methods.getSignedJwToken = function () {
    const token = jwt.sign({
            id: this._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE,
        }
    );
    return { token };
};


//Match input password with encrypted password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", UserSchema);