// create router 
import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";
import { protedtRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup" , signup);

userRouter.post("/login" , login);

userRouter.put("/update-profile" , protedtRoute , updateProfile);

userRouter.get("/check" , protedtRoute , checkAuth);


export default userRouter;