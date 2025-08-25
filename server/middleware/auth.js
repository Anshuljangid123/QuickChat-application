// it is executed before the controller function . 

import User from "../models/User.js";
import jwt from "jsonwebtoken";

// middleware to protect routes

export const protedtRoute = async(req , res ,next) => {

    try{
        const token = req.headers.token ;
        // take the token from the headers 

        // decode token 
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.json({success : false , message : "user not found"});
        }

        req.user = user ; // add the user data in the req to use it in controller funciton 
        // attaches the authenticated user’s details (fetched from DB) to the request object, so that subsequent middlewares or controllers can use it easily.
        next(); 
    }

    catch(error){
        res.json({success : false , message : error.message});
        console.log(error.message);
    }
}