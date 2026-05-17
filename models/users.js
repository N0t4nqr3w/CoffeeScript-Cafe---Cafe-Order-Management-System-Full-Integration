import mongoose from "mongoose";

const userSchema =  new mongoose.Schema({
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: [true,"That email is already in use"],
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/,"Email is invalid"]
    },
    password: {
        type: String,
        required: [true,"Password is required"]
    },
    name: {
        type: String,
        required: [true,"Name is required"],
        trim: true
    },
    phone: {
        type: String,
        required: true,
        required: [true,"Phone number is required"],
        match: [/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,"Phone number is invalid"]
    },

    active: {
        type: Boolean,
        default: true
    },

    createdDate: {
        type: Date,
        default: Date.now
    },

    type: {
        type: String,
        enum: ["Customer","Staff"]
    }
});

userSchema.virtual("daysSinceCreated").get(function () {
    const now = new Date();
    const created = this.hiredDate;
    const diffTime = Math.abs(now-created);
    const diffDays = Math.ceil(diffTime/(1000*60*60*24));
    return diffDays;
});

userSchema.virtual("status").get(function () {
    return this.active ? "Active" : "Inactive";
});

userSchema.virtual("isCustomer").get(function () {
    return type==="Customer";
});

userSchema.virtual("isStaff").get(function () {
    return type==="Staff";
});

export default mongoose.model("Users", userSchema);