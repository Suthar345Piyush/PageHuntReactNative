import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
// import dotenv from "dotenv/config";

const router = express.Router();

// generate token function 
const generateToken = (userId) => {
    return  jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn : "15d"});
}

router.post("/register" , async (req , res) => {
    try {
      const {email , username , password} = req.body;

      if(!username || !email || !password) {
         return res.status(400).json({message : "All fields are required"});
      }

      if(password.length < 6){
         return res.status(400).json({message : "Password atleast of 6 characters"});
      }

      if(username.length < 3){
        return res.status(400).json({message : "Username should be more than 3 characters"});
      }

      // checking of user already exists 

      const existingUserCheck = await User.findOne({$or : [{email} , {username} , {password}]});

      if(existingUserCheck) return res.status(400).json({message : "User already exists"});


      // get an random avatar 

      const profileImage = `https://api.dicebear.com/9.x/notionists/svg?seed=${username}`;

      const user = new User({
         email,
         username,
         password,
         profileImage
      })

      await user.save();

      // genereate the token, not storing into db instead sending to the client 

      const token = generateToken(user._id);

      res.status(201).json({
        token,
        user : {
           id : user._id,
           username : user.username,
           email : user.email,
           profileImage : user.profileImage, 
        },
      });

    } catch (error) {
       console.log("Error in register route" , error);
       res.status(500).json({ message : "Internal server error"});
    }
});

router.post("/login", async (req , res) => {
    try {
       const {email , password} = req.body;
        
      if(!email || !password) return res.status(400).json({message : "All fields required to be filled"});

      // checks if user already exists or not 

      const user = await User.findOne({email});
      if(!user) return res.status(400).json({message : "User does not exists"});

      // password checks 

    const isPasswordCorrect = await user.comparePassword(password);
     if(!isPasswordCorrect) return res.status(400).json({
       message : "Invalid credentials"
     });

     const token = generateToken(user._id);

     res.status(200).json({
       token,
        user : {
          id: user._id,
          username : user.username,
          email : user.email,
          profileImage : user.profileImage,
        },
     });

    } catch (error) {
      console.log("Error in login route" , error);
      res.status(500).json({message : "Internal server error"});
    }
});



export default router;

