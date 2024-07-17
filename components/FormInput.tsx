import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import { useFormContext, Controller } from "react-hook-form";

interface FormInputProps {
  label: string;
  formKey: string;
  placeholder: string;
  secureTextEntry?: boolean;
  rules?: object;
}

const FormInput: FC<FormInputProps> = ({
  label,
  formKey,
  placeholder,
  secureTextEntry = false,
  rules = {},
}) => {
  const { colors } = useTheme();
  const { control } = useFormContext();

  return (
    <View>
      <Text variant="bodyLarge">{label}</Text>
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              mode="outlined"
              secureTextEntry={secureTextEntry}
              value={value}
              placeholder={placeholder}
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!error}
            />
            {error && (
              <Text variant="bodySmall" style={{ color: colors.error }}>
                {" "}
                {error?.message}
              </Text>
            )}
          </>
        )}
        name={formKey}
        rules={rules}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
  },
});

export default FormInput;
