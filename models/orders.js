import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    baristaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },

    itemIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItems",
        required: true
    }],

    totalCost: { //stored as cents to avoid floating point errors
        type: Number,
        required: true,
        min: 0
    },

    status: {
        type: String,
        enum: ["In Progress","Completed","Canceled"],
        default: "In Progress"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },

    orderNum: {
        type: Number,
        required: true
    }
});

export default mongoose.model("Orders", orderSchema);