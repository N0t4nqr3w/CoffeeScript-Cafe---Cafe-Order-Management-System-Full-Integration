import express from "express";
import Order from "../models/orders.js"
import menuItems from "../models/menuItems.js";
import orders from "../models/orders.js";

export const router = express.Router();


router.get("/", async (req,res)=>{
    try{
        let orders;
        if(req.query.sort !== undefined){
            if(req.query.sort === "cost"){
                orders = await Order.find().sort("totalCost");
            } else {
                orders = await Order.find();
            }
        } else {
            orders = await Order.find();
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
        if(limit > 0 && page > 0) orders = orders.slice(limit*(page-1),limit*page);

        //if we have only a limit, we can assume it starts at 0
        else if(limit > 0 && page <= 0) orders = orders.slice(0,limit);


        res.json(orders);
    }
    catch(err){
        res.status(400).send(err.message);
    }
});

// get one order by id
router.get("/:id", async (req,res)=>{
    try{
        const order = await Order.findById(req.params.id);
        if(!order){
            return res.status(404).json({error: "Order not found"})
        }
        res.json(order);
    }
    catch(err){
        res.status(400).send(err.message);
    }
});

router.post("/", async (req,res)=>{
    try{
        const{itemIds,baristaId,status,createdBy} = req.body;

        const totalCost = await calculatePrice(itemIds);
  
        const order = new Order({
            baristaId,
            itemIds, 
            totalCost,
            status,
            createdBy
        });
        
        await order.save();
        console.log(order.itemIds);
        
        res.json(order)
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
});

router.put("/:id", async (req,res)=>{
    try{
        const orderUpdate = await Order.findById(req.params.id);
        if(!orderUpdate){
            return res.status(404).json({error: "Order not found"});
        }

        if(req.body.baristaId !== undefined) {
            orderUpdate.baristaId = req.body.baristaId;
        }

        if(req.body.itemIds !== undefined) {
            orderUpdate.itemIds = req.body.itemIds;

            //the list of items has been changed, update total cost
            const price = await calculatePrice(req.body.itemIds);
            orderUpdate.totalCost = price;
        }

        if(req.body.status !== undefined) {
            orderUpdate.status = req.body.status;
        }

        if(req.body.createdBy !== undefined) {
            orderUpdate.createdBy = req.body.createdBy;
        }

        await orderUpdate.save();
        res.json(orderUpdate);
    }
    catch(err){
        res.status(400).json({error: err.message});
    }

});

router.delete("/:id", async (req,res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});


async function calculatePrice(itemIds) {
    const items = await menuItems.find({_id: {$in: itemIds}});
    let price = 0;
    for (const item of items) {
        price += item.price;
    }

    return price;
}

