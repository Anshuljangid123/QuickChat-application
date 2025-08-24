// creating server
import express from "express"
import "dotenv/config" ;
import cors from "cors";
import http from "http";
import { connectDb } from "./lib/db.js";

// create express app and http server
const app = express();

const server = http.createServer(app);

// middlewares  setup 
app.use(express.json({limit : "4mb"})); // photo size  limit  to upload .

app.use(cors());

// add routes

app.use("/api/status" , (req ,res) => res.send("server is live ") );

// connect to mongo db 
await connectDb();

// define port numbe
const PORT = process.env.PORT || 5001;
server.listen(PORT , () => console.log("server is running on PORT : "  + PORT ));



// mongodb+srv://anshuljan2003:<db_password>@cluster0.pb6n99o.mongodb.net