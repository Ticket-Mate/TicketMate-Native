import { HomePageStackParamList } from "@/components/navigation/HomePageNavigation";
import { ThemedView } from "@/components/ThemedView";
import useUser from "@/hooks/useUser";
import { StackNavigationProp } from "@react-navigation/stack";
import { FC } from "react";
import { Text } from "react-native-paper";

type HomeScreenProps = {
    navigation: StackNavigationProp<HomePageStackParamList>;
};


const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
    const {user} = useUser()
    return (
        <ThemedView>
            <Text>Home Screen + {JSON.stringify(user)}</Text>
        </ThemedView>
    )
}

export default HomeScreen;