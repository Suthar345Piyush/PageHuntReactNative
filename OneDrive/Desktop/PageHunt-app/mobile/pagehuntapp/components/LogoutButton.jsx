// button for logout the user  

import {View , Text , TouchableOpacity , Alert} from "react-native";
import { useAuthStore } from "../store/authStore.js";
import styles from "../assets/styles/profile.styles.js";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors.js";


export default function LogoutButton() {
    const {logout} = useAuthStore();

    const confirmLogout = () => {
       Alert.alert("Logout" , "Are you sure to logout" , [
         {
          text : "Cancel" , style="cancel"
         },
         {
          text : "Logout" , onPress : () => logout() , style="destructive"
         }
        ]);
    };


    return (
       <TouchableOpacity style={style.LogoutButton} onPress={confirmLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.white}/>
          <Text style={styles.logoutText}>Logout</Text>
       </TouchableOpacity>
    )
};

