import { ActivityIndicator } from "react-native-paper"
import { ThemedView } from "./ThemedView"

const Loader = () => {
    return (
        <ThemedView style={{display:'flex', justifyContent:'center'}}>
            <ActivityIndicator size={60} animating={true} />
        </ThemedView>
    )
}

export default Loader;