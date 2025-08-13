import { View, Text , StyleSheet} from 'react-native';
import COLORS from "../constants/Colors.js";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function SafeScreen({children}) {

    const insets = useSafeAreaInsets();

    return <View style={[styles.container , {padddingTop : insets.top}]}>{children}
    </View>;
}


const styles = StyleSheet.create({
    container : {
       flex : 1,
       backgroundColor : COLORS.background,
    },
});

