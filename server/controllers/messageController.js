// stiore the msg in db and show the message on web page 

import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { io } from "../server.js";
import { userSocketMap } from "../server.js";
// get all user except logged in user 
// count the number of unseen messages 
export  const getUserForSidebar = async(req , res) =>{
    try{    
        const userId = req.user._id; // these are the id's of the logged in users 
        const filteredUsers = await User.find({_id : {$ne : userId}}).select("-password") // ne == not equal 
        // remove the password from the data 

        // count the number of unseen messagees 
        const unseenMessages = {};
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({senderId : user._id , receiverId : userId , seen : false});
            // check the length
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })  
        await Promise.all(promises);
        res.json({success : true , users: filteredUsers , unseenMessages});
    }
    catch(error){
        console.log(error.message);
        res.json({success : false , message : error.message});
    }
}

// get all messages for the selected users
export const getMessage = async(req , res) => {
    try{
        const {id : selectedUserId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or : [
                {senderId : myId , receiverId : selectedUserId},
                {senderId : selectedUserId, receiverId : myId}
                // display all the messages between two users .
            ]

        })
        
        // for the senderId , receiverId messages -> we are changing the seen property to true 
        // turn the unseen message to seen messages . 
        await Message.updateMany({senderId : selectedUserId , receiverId : myId } , {seen : true});

        // generate the response 
        res.json({success : true , messages});

    }
    catch(error){
        console.log(error.message);
        res.json({success : false , message : error.message});
    }
}

// function to mark the meesages as seen messages using id -> api to mark the messages as seen using message id.

export const markMessageAsSeen = async (req , res) => {
    try{
        const {id} = req.params;
        // take the id from the req object from the params .
        await Message.findByIdAndUpdate(id , {seen : true});
        // mark the message as seen using the id
        res.json({success :true});
    }
    catch(error){
        console.log(error.message);
        res.json({success : false , message : error.message});
    }
}

// send messages to selected user . 
// function to send the new message and store in the database . 
export const sendMessage = async(req , res) =>{
    try{
        const {text , image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl ;
        if(image){
            // if image is available 
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId , 
            receiverId , 
            text , 
            image : imageUrl
        })

        // update the message to socket 
        // emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage" , newMessage)
        }

        
        res.json({success : true , newMessage});

    }
    catch(error){
        console.log(error.message);
        res.json({success : false , message : error.message});
    }
}