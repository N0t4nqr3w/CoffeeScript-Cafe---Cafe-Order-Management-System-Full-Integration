import express from "express";
import MenuItems from "../models/menuItems.js";
import { authenticateToken } from "../middleware/auth.js";

export const router = express.Router();

router.get("/", async(req, res) => {
    try{
        let menuItems;
        if(req.query.search){
            //Uses %regex to search for an item that has a name matching what is in the query(case insensitive)
            menuItems = await MenuItems.find({
                "name" : {$regex: req.query.search, $options: "i"}
            });
        } else if(req.query.ingredient){
            //Uses $in to locate items with an ingredient that was entered in the query(case sensitive)
            menuItems = await MenuItems.find({
                "ingredients": {$in: req.query.ingredient}
            });
        } else {
            menuItems = await MenuItems.find();
        }
        //Used to filter menu items by category through the query
        if(req.query.category !== undefined){
            const category = req.query.category;
            menuItems = menuItems.filter(m => m.category === category);
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
        if(limit > 0 && page > 0) menuItems = menuItems.slice(limit*(page-1),limit*page);

        //if we have only a limit, we can assume it starts at 0
        else if(limit > 0 && page <= 0) menuItems = menuItems.slice(0,limit);

        res.json(menuItems);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get("/:name", async(req, res) => {
    try{
        const item = await MenuItems.findOne({name: req.params.name})
        res.json(item);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post("/", authenticateToken, async(req, res) => {
    try{
        const menuItem = new MenuItems(req.body);
        await menuItem.save();
        res.status(201).json(menuItem);
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
});

router.put("/:id", authenticateToken, async(req, res) => {
    try{
        const menuItem = await MenuItems.findById(req.params.id);
        if(!menuItem){
            res.status(404).json({error: "Item not found"});
        }

        if(req.body.name !== undefined) {
            menuItem.name = req.body.name;
        }
        if(req.body.category !== undefined) {
            menuItem.category = req.body.category;
        }
        if(req.body.description !== undefined) {
            menuItem.description = req.body.description;
        }
        if(req.body.price !== undefined) {
            menuItem.price = req.body.price;
        }
        if(req.body.ingredients !== undefined) {
            menuItem.ingredients = req.body.ingredients;
        }
        if(req.body.inStock !== undefined) {
            menuItem.inStock = req.body.inStock;
        }
        await menuItem.save();
        res.json(menuItem);
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
});

router.delete("/:id", authenticateToken, async(req, res) => {
    try{
        await MenuItems.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }
    catch(err) {
        res.status(500).json({error: err.message});
    }
});