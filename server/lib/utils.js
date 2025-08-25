// create token generation function 
import jwt from "jsonwebtoken"

export const generateToken = (userId) => {
    // it uses the user id and key to generate token . 
    const token = jwt.sign({userId} , process.env.JWT_SECRET );
    return token ; 
}