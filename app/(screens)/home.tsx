import { HomePageStackParamList } from "@/components/navigation/HomePageNavigation";
import { ThemedView } from "@/components/ThemedView";
import { StackNavigationProp } from "@react-navigation/stack";
import { FC } from "react";
import { Text } from "react-native-paper";

type HomeScreenProps = {
    navigation: StackNavigationProp<HomePageStackParamList>;
};


const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
    return (
        <ThemedView>
            <Text>Home Screen</Text>
        </ThemedView>
    )
}

export default HomeScreen;