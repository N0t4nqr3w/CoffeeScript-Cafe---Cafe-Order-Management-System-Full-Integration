import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Users from "../models/users.js"

export const router = express.Router();

router.post("/register", async(req,res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {email,password,name,phone,type} = req.body;

        const user = new Users({email,password,name,phone,type});
        await user.save(session);
        await session.commitTransaction();

         res.status(201).json({message: `${type} account created successfully`});
    } catch(err) {
        await session.abortTransaction();
        res.status(500).json({ error: err.message });
    } finally {
        session.endSession();
    }
});


router.post("/login", async(req,res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(401).json({
                error: "Missing email and/or password",
            });
        }

        // Find user by email
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(401).json({
                error: "Invalid username or password",
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                error: "Invalid username or password",
            });
        }

        // Create token
        const payload = {
            id: user._id,
            email: user.email
        };
    
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24h"
        })
    
        // Login successful! - Return token to client
        res.json({
            message: "Login successful",
            token: token,
            user: {
            id: user._id,
            email: user.email,
            type: user.type,
            name: user.name
            }
        });

    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});