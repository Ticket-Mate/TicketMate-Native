import { HomePageStackParamList } from "@/components/navigation/HomePageNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";

const useLogout = ({navigation}: { navigation: StackNavigationProp<HomePageStackParamList>}) => {
    
    const logoutUser = () => {
        AsyncStorage.removeItem('user');
        navigation.navigate("Login" as any)
    };

    return {logoutUser}
}

export default useLogout;