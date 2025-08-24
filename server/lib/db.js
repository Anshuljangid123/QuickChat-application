import mongoose from "mongoose";

// funciton to connet to mongodb database

export const connectDb = async()=> {
    try{
        mongoose.connection.on("connected" , () => console.log("db connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
        
    }
    catch(error){
        console.log( "db connection error ->-------------" , error);
        
    }
}