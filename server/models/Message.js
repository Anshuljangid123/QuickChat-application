// user model file 
import mongoose from "mongoose";


// user schema
const messageSchema = new mongoose.Schema({
    senderId : {type : mongoose.Schema.Types.ObjectId , ref : "User" , required :true},
    receiverId : {type : mongoose.Schema.Types.ObjectId , ref : "User" , required :true},
    text : {type : String},
    image : {type : String},
    seen : {type : Boolean , default : false }
    
} , {timestamps : true});


// create user model
const Message = mongoose.model("Message" , messageSchema);

export default Message;



