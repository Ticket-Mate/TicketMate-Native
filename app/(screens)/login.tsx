import { FC, useEffect } from "react";
import Header from "@/components/Header";
import { StyleSheet, View, Modal } from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import { ThemedView } from "@/components/ThemedView";
import { StackNavigationProp } from "@react-navigation/stack";
import NavigationLink from "@/components/navigation/NavigationLink";
import { HomePageStackParamList } from "@/components/navigation/HomePageNavigation";
import { FormProvider, useForm } from "react-hook-form";

import FormInput from "@/components/FormInput";
import { LoginData } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";

type LoginScreenProps = {
  navigation: StackNavigationProp<HomePageStackParamList>;
};


const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  const methods = useForm<LoginData>();
  const { user, loginStatus, handleLogin } = useAuth()
  const { isLoading, isError, isSuccess } = loginStatus;

  useEffect(() => {
    if (user) {
      navigation.navigate("Home" as any)
    }
  }, [user])

  return (
    <FormProvider {...methods}>
      <ThemedView>
        <Header />
        <View style={styles.container}>
          <Text variant="headlineSmall" style={styles.containerHeader}>
            Login
          </Text>
          <FormInput
            label="Email"
            formKey="email"
            placeholder="Enter your email"
            rules={{ required: "email is required" }}
          />
          <FormInput
            label="Password"
            formKey="password"
            placeholder="Enter your password"
            secureTextEntry={true}
            rules={{ required: "Password is required" }}
          />
          <NavigationLink
            onPress={() => navigation.navigate("Signup" as any)}
            text="Don't have an account?"
            linkText="Sign Up"
          />
          <Button
            style={{ marginTop: 15 }}
            icon="login"
            mode="contained"
            onPress={methods.handleSubmit(async (data: LoginData) => {
              await handleLogin(data);
            })}
          >
            Login
          </Button>
        </View>
        {isLoading && (
          <Modal transparent={false} animationType="none">
            <View style={styles.loadingContainer}>
              <ActivityIndicator animating={true} size={120} />
            </View>
          </Modal>
        )}
      </ThemedView>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 15,
    margin: 20,
    marginTop: 40,
  },
  containerHeader: {
    fontWeight: "700",
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
