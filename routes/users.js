import express from "express";
import Users from "../models/users.js";
import { authenticateToken } from "../middleware/auth.js";

export const router = express.Router();

router.get("/", authenticateToken, async(req, res) => {
    try{
        let users;
        if(req.query.sort !== undefined){
            if(req.query.sort === "name"){
                users = await Users.find().sort("name");
            }
            else if(req.query.sort === "date") {
                users = await Users.find().sort("hiredDate");
            } else {
                users = await Users.find();
            }
        } else {
            users = await Users.find();
        }
        
        if(req.query.active !== undefined){
            const isActive = req.query.active === "true";
            users = users.filter(u => u.active === isActive);
        }
        //filter specifically for customers or staff
        if(req.query.type !== undefined) {
            if(req.query.type == "customer" || req.query.type == "staff") {
                users = users.filter(u => u.type.toLowerCase() == req.query.type.toLowerCase());
            }
        }

        let limit = -1;
        if(req.query.limit !== undefined) {
             limit = parseInt(req.query.limit);
             if (isNaN(limit) || limit < 1) {
                return result.status(400).json({error:"Limit must be a positive integer"});
            }
        }

        let page = -1;
        if(req.query.page !== undefined) {
             page = parseInt(req.query.page);
             if (isNaN(page) || page < 1) {
                return result.status(400).json({error:"Page must be a positive integer"});
            }
        }

        //if we have a limit and a page, we can take a range based on the two values
        if(limit > 0 && page > 0) users = users.slice(limit*(page-1),limit*page);

        //if we have only a limit, we can assume it starts at 0
        else if(limit > 0 && page <= 0) users = users.slice(0,limit);
        
        res.json(users);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});


router.post("/", authenticateToken, async(req, res) => {
    try{
        const user = new Users(req.body);
        await user.save();
        res.status(201).json(user);
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
});

router.put("/:id", authenticateToken, async(req, res) => {
    try{
        const user = await Users.findById(req.params.id);
        if(!user){
            res.status(404).json({error: err.message});
        }

        if(req.body.name !== undefined){
            user.name = req.body.name;
        }
        if(req.body.email !== undefined){
            user.email = req.body.email;
        }
        if(req.body.phone !== undefined){
            user.phone = req.body.phone;
        }
        if(req.body.active !== undefined){
            user.active = req.body.active;
        }
        if(req.body.hiredDate !== undefined){
            user.hiredDate = req.body.hiredDate;
        }
        if(req.body.password !== undefined){
            user.password = req.body.password;
        }
        if(req.body.type !== undefined) {
            user.type = req.body.type
        }
        await user.save();
        res.json(user);
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
});

router.delete("/:id", authenticateToken, async(req, res) => {
    try{
        await Users.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }
    catch(err) {
        res.status(500).json({error: err.message});
    }
});