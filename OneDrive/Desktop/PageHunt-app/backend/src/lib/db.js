import mongoose from "mongoose";

export const connectDB = async () => {
    try {
       const connec = await mongoose.connect(process.env.MONGO_URI);
        console.log(`DB connected ${connec.connection.host}`);
    } catch (error) {
       console.log("Error connecting to DB" , error);
       process.exit(1);  // exit 0 -> success , 1 -> failure
   
      
    };
};


