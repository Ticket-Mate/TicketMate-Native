import { HomePageStackParamList } from "@/components/navigation/HomePageNavigation";
import { ThemedView } from "@/components/ThemedView";
import useLogout from "@/hooks/useLogout";
import useUser from "@/hooks/useUser";
import { StackNavigationProp } from "@react-navigation/stack";
import { FC } from "react";
import { Button, Text } from "react-native-paper";

type HomeScreenProps = {
    navigation: StackNavigationProp<HomePageStackParamList>;
};


const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
    const {user} = useUser()
    const {logoutUser} = useLogout({navigation})
    return (
        <ThemedView>
            <Text>Home Screen + {JSON.stringify(user)}</Text>
            <Button onPress={logoutUser}>LogOut</Button>
        </ThemedView>
    )
}

export default HomeScreen;