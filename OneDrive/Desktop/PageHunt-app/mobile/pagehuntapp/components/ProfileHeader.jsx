// profile header  section / part
// info about user profile , like id , joining time etc.

import {Text , View } from "react-native";
import { useAuthStore } from "../store/authStore.js";
import styles from "../assets/styles/profile.styles.js";
import { Image } from "expo-image";
import { formatMemberSince } from "../lib/utils.js";


export default function ProfileHeader() {
     const { user } = useAuthStore();

     if(!user) return null;


     return (
       <Text style={styles.profileHeader}>
         <Image source={{uri : user.profileImage}} style={styles.profileImage}/>
           <View style={styles.profileInfo}>
            <Text style={styles.username}>
            {user.username}
            </Text>

           {/* // user own email and other info  */}

           <View style={styles.email}>
            {user.email}
           </View>

   {/* // user application joining time  */}

           <Text style={styles.memberSince}>
            Joined on {formatMemberSince(user.createdAt)}
           </Text>
         </View>
       </Text>
     );
}



