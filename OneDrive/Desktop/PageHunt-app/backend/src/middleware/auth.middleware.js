// authentication middleware  
import  jwt from "jsonwebtoken";
import User from "../models/User.js";


const protectRoute = async(req , res , next) =>  {
     try{

          // get the token from the jwt 
          const token = req.header("Authorization").replace("Bearer" , "");

          // verify the obtained token 
          const verifyToken = jwt.verify(token . process.env.JWT_SECRET);


          // find the user 

          const user = await User.findById(verifyToken.userId).select("-password");

          if(!user) return res.status(401).json({message : "Token is not valid"});
        
          req.user = user;
          next();
     } catch(error){
        console.log("Authentication Error:" , error.message);
        res.status(401).json({message : "Token is  not valid"});
     }
};



export default protectRoute;

