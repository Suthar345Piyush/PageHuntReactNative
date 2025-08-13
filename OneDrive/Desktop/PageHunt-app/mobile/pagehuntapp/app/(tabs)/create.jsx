// create post page WORK

import {useState} from "react";
import { View , Text , Platform , KeyboardAvoidingView , Alert , ScrollView , TextInput , TouchableOpacity , Image , ActivityIndicator } from "react-native";

import {useRouter} from "expo-router";
import styles from "../../assets/styles/create.styles";
import {Ionicons} from "@expo/vector-icons";
import COLORS from "constants/colors.js";
import {useAuthStore} from "../../store/authStore.js";


import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { API_URL } from "constants/api.js";



export default function create() {
     const [title , setTitle] = useState("");
     const [caption , setCaption] = useState("");
     const [rating , setRating] = useState("");
     const [image , setImage] = useState(null);
     const [imageBase64 , setImageBase64] = useState(null);
     const [loading , setLoading] = useState(false);


     const router = useRouter();
     const {token} = useAuthStore();


// image picker function for taking the  image from the user's gallery 

     const pickImage = async () => {
       try {
          // permission needed to get the access 
          if(Platform.OS !== "web"){
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if(status !== "granted"){
               Alert.alert("Permission Denied" , "We need camera roll permisssions to upload an image");
               return;
            }
          }

          // to the image gallery (space)
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes : "images",
            allowsEditing : true,
            aspect : [4 , 3],
            quality : 1,
            base64 : true,
          });


          if(!result.canceled){
             setImage(result.assets[0].uri);


             // if base64 is provided , then use it 
             if(result.assets[0].base64){
               setImageBase64(result.assets[0].base64);
             }
              else {
                 // if not , then convert it into base64 
                 const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri , {
                   encoding :FileSystem.EncodingType.Base64,
                 });
                 setImageBase64(base64);
             }
          }
       } catch(error){
          console.log("Error picking image: " , error);
          Alert.alert("Error" , "Something went wrong!!");
       }
     };


     // if user submit the image , handle it  

     const handleSubmit = async ()  => {
       if(!title || !caption || !imageBase64 || !rating) {
         Alert.alert("Error" , "Fill the details about book");
         return;
       }

       try {
         setLoading(true);
   
         // getting the file , and to jpeg format 
         const uriParts = image.split(".");
         const fileType = uriParts[uriParts.length - 1];
         const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";


         imageDataUrl = `data:${imageType};base64,${imageBase64}`;


         const response = await fetch(`${API_URL}/books` , {
           method : "POST",
           headers : {
             Authorization : `Bearer ${token}`,
             "Content-Type" : "application/json",
           },
           body : JSON.stringify({
             title,
             caption,
             rating : rating.toString(),
             image : imageDataUrl,
           }),
         });


         const data = await response.json();
         if(!response.ok) throw new Error(data.message || "Something went wrong!!");

         Alert.alert("Success" , "Your book recommendation has been posted");
         setTitle("");
         setRating("");
         setCaption("");
         setImage(null);
         setImageBase64(null);
         router.push("/");
       } catch (error) {
         console.log("Error creating post: ", error);
         Alert.alert("Error" , error.message || "Something went wrong");
       } finally {
         setLoading(false);
       }
     };


     // function logic for rating bw 1-5 stars 
     
     const renderRatingPicker = () => {
       const stars = [];
       for(let i=1; i<=5; i++){
         stars.push(
           <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
            <Ionicons name={i <= rating ? "star" : "star-outline"} size={32} color={i <= rating ? "#f4b400" : COLORS.textSecondary}/>
           </TouchableOpacity>
         );
       }
       return <View style={styles.ratingContainer}>{stars}</View>
     };

     return (
      <KeyboardAvoidingView style={{flex : 1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>

        <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
           <View style={styles.header}>
             <Text style={styles.title}>Add Book recommendation</Text>
             <Text style={styles.subtitle}>Share your favorite reads with others</Text>
           </View>

           <View style={styles.form}>
             {/* book title */}
             <View style={styles.formGroup}>
               <Text style={styles.label}>Book title</Text>
               <View style={styles.inputContainer}>
                  <Ionicons name="book-outline"
                   size={20}
                    color={COLORS.textSecondary}
                     style={styles.inputIcon}/>
                     <TextInput style={styles.input}
                      placeholder="Enter the book title"
                       placeholderTextColor={COLORS.placeholderText}
                       value={title}
                        onChangeText={setTitle} />
               </View>
             </View>

              {/* rating section  */}

              <View style={styles.formGroup}>
                <Text style={styles.label}>Rating</Text>
                 {renderRatingPicker}
              </View>


               {/* image of the book  */}

               <View style={styles.formGroup}>
                 <Text style={styles.label}>Book Image</Text>
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                  {image ? (
                     <Image source={{uri : image}} style={styles.previewImage}/>
                  ) : (
                     <View style={styles.placeholderContainer}>
                       <Ionicons name="image-outline" size={40}/> 
                       <Text style={styles.placeholderText}>Tap to select the image.</Text>
                     </View>
                  )}
                </TouchableOpacity>
               </View>

                {/* Caption part/section  */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Caption</Text>
                  <TextInput style={styles.textArea}
                   placeholder="Write something about this book."
                    placeholderTextColor={COLORS.placeholderText}
                     value={caption}
                      onChangeText={setCaption}
                       multiline
                      />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                     <>
                      <Ionicons name="cloud-upload-outline"
                       size={20}
                        color={COLORS.white}
                        style={styles.buttonIcon}/>
                        <Text style={styles.buttonText}>Share it!</Text>
                     </>
                  )}
                </TouchableOpacity>
           </View>
        </ScrollView>
      </KeyboardAvoidingView>
     );
};





