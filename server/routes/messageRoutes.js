import express from "express";
import { protedtRoute } from "../middleware/auth.js";
import { getMessage, getUserForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users" , protedtRoute , getUserForSidebar)
messageRouter.get("/:id" , protedtRoute , getMessage);

messageRouter.put("/mark/:id" , protedtRoute , markMessageAsSeen);// update the data

messageRouter.post("/send/:id" , protedtRoute , sendMessage);

export default messageRouter;