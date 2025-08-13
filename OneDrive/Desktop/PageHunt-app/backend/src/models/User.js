// User's schema for the DB 
import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
       username : {
         type : String,
         required : true,
         unique : true
       },
       email : {
         type : String,
         required : true,
         unique : true
       },
       password : {
         type : String,
        required : true,
        minLength : 6
       },
       profileImage : {
          type : String,
          default : ""
       }
} , { timestamps : true });


//password hashing before saving the real password , using bcrypt library for this

userSchema.pre("save" , async function(next){

   // if password doesn't modified , then don't hash it again

   if(!this.isModified("password")) return next();

  // generate salt of that password , "more number more security"

    const salt = await bcrypt.genSalt(10);

    // this -> current user 

    this.password = await bcrypt.hash(this.password , salt);

    next();
});

// compare the password(old to new) function 
// using bcrypt to compare the current password to the password that in the db

userSchema.methods.comparePassword = async function (userPassword) {
    // if it is true,then return true , else return false
    return await bcrypt.compare(userPassword , this.password);
}







const User = mongoose.model("User" , userSchema);

// User -> users

export default User;



