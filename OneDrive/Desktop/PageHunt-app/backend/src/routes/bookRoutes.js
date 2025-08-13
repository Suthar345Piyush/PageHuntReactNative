import  express  from "express";
import cloudinary from "../lib/cloudinary.js";
import protectRoute from "../middleware/auth.middleware.js";
import Book from "../models/Book.js";


const router = express.Router();

router.post("/" , protectRoute , async (req , res) => {
   try {

      const { title , image  , caption , rating} = req.body;

       if(!title || !image || !caption || !rating)  {
          return res.status(400).json({ message : "All fields are required to be filled"});
       }

       // upload the image to the cloudinary 

        const uploadImage = await cloudinary.uploader.upload(image);

        const imageUrl = uploadImage.secure_url;


        // save to the db

        const newBook = new Book({
           title,
           caption,
           rating,
           image : imageUrl,
           user : user._id,
        });

        // save method 

        await newBook.save();
        

        res.status(201).json(newBook);
   } catch(error) {
       console.log("Error in creating Book" , error);
       res.status(500).json({message : error.message});
   }
});


/* fetching the data from db and showing them using pagination 
  most liked post at the top , in descending order 
  
  some db method's used for PAGINATION according to the query provided  
  */



router.get("/" , protectRoute ,  async (req , res) => {
    try{ 
       const page = req.query.page || 1;
       const limit = req.query.page || 6;
       const skip = (page - 1) * limit;

        const books = (await Book.find().sort({ createdAt : -1})).skip(skip).limit(limit).populate("user" , "username profileImage");

        //total books in the db's

        const totalBooks = await Book.countDocuments();

        res.send({
          books,
          totalBooks,
          currentPage : page,
          totalPages : Math.ceil(totalBooks / limit),
        });


    } catch (error){
        console.log("Error in getting the books" , error.message);
        res.status(500).json({message : "Internal server error"});
    }
});

// getting recommended books by the authenticated users 

router.get("/user" , protectRoute , async (req , res) => {
   try{
      const books = await Book.find({user : req.user._id}).sort({ createdAt : -1 }); // sorted in descending order
      res.json(books); 
   } catch (error){
      console.error("Error occured in getting books" , error.message);
      res.status(500).json({ message : "Internal Server error"});
   }
});


// delete the books 

router.delete("/:id" , protectRoute , async (req , res ) => {
    try {

       //find the book 

       const book = await Book.findById(req.params.id);
       if(!book) return res.status(404).json({message : "Book not found"});

       //check the authorized user to delete the book 

       if(book.user.toString() !== req.user._id.toString()) 
          return res.status(401).json({message : "Unauthorized user"});

          //deleting the image from the cloudinary 

          if(book.image && book.image.includes("cloudinary")){
             try {
               const publicId = book.image.split("/").pop().split(".")[0];

            await cloudinary.uploader.destroy(publicId);

             } catch(deleteError){
               console.log("Error deleting image from cloudinary" , deleteError);
             }
          };

       await book.deleteOne();
       res.json({message : "Book deleted successfully"});


    } catch(error){
       console.log("Error deleting the book" , error);
       res.status(500).json({message : "Internal error"});
    }
});




export default router;

