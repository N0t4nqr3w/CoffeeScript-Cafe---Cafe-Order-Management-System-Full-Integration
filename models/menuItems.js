import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    category: {
        type: String,
        enum: ["Hot Drink","Cold Drink","Hot Food","Cold Food","Other"],
        required: true,
        default: "Other"
    },

    description: {
        type: String
    },

    price: { //stored as cents to avoid floating point errors
        type: Number,
        required: true,
        min: 0
    },

    ingredients: [{
        type: String,
        trim: true
    }],

    inStock: {
        type: Boolean,
        default: true
    }
});

menuSchema.virtual("priceInDollars").get(function () {
    return (this.price/100).toLocaleString("en-US", {style:"currency", currency:"USD"});
});

export default mongoose.model("MenuItems",menuSchema);