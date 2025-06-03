import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { COLORS, FONTS } from "../constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";

const Input = ({
  type = "text",
  size = "medium",
  variant = "outlined",
  icon = null,
  rightIcon = null,
  disabled = false,
  onChangeText,
  placeholder = "",
  label,
  fillColor = "transparent",
  labelGap = 10,
  infoText = "",
  errorText = "",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Size styles
  const sizeStyles = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  }[size];

  // Variant styles
  const variantStyles = {
    filled: { backgroundColor: fillColor, borderWidth: 0 },
    outlined: {
      backgroundColor: fillColor,
      borderWidth: 1,
      borderColor: COLORS.lightGray,
    },
  }[variant];

  // Input type handling
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <View style={[styles.container]}>
      {label && (
        <Text style={[styles.label, { marginBottom: labelGap }]}>{label}</Text>
      )}

      <View style={[styles.inputWrapper, variantStyles]}>
        {icon && <View style={styles.iconLeft}>{icon}</View>}

        <TextInput
          style={[
            styles.input,
            sizeStyles,
            icon && { paddingLeft: 40 },
            rightIcon || type === "password" ? { paddingRight: 40 } : {},
          ]}
          editable={!disabled}
          placeholder={placeholder}
          secureTextEntry={type === "password" && !showPassword}
          onChangeText={onChangeText}
          placeholderTextColor="#aaa"
          keyboardType={type}
          {...rest}
        />

        {(type === "password" || rightIcon) && (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() =>
              type === "password" ? setShowPassword(!showPassword) : null
            }
          >
            {type === "password" ? (
              showPassword ? (
                <Ionicons
                  style={styles.iconImage}
                  name="eye-outline"
                  size={24}
                />
              ) : (
                <Ionicons
                  style={styles.iconImage}
                  name="eye-off-outline"
                  size={24}
                />
              )
            ) : (
              rightIcon
            )}
          </TouchableOpacity>
        )}
      </View>

      {(infoText || errorText) && (
        <Text style={[styles.supportingText, errorText && styles.errorText]}>
          {errorText || infoText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  label: {
    fontSize: FONTS.normal,
    fontWeight: 400,
    color: COLORS.black,
    fontFamily: "Suse-Medium",
  },
  inputWrapper: { position: "relative", borderRadius: 8, overflow: "hidden" },
  input: {
    padding: 15,
    fontSize: FONTS.normal,
    color: COLORS.black,
    width: "100%",
    fontFamily: "Suse-Regular",
  },
  small: { height: 40, padding: 8 },
  medium: { height: 48 },
  large: { height: 56, padding: 20 },
  iconLeft: {
    position: "absolute",
    top: 12,
    left: 10,
    justifyContent: "center",
  },
  iconRight: {
    position: "absolute",
    right: 10,
    top: 12,
    justifyContent: "center",
  },
  iconImage: { width: 24, height: 24 },
  supportingText: {
    marginTop: 0,
    fontSize: FONTS.small,
    fontWeight: 600,
    color: "#666",
    fontFamily: "Suse-SemiBold",
  },
  errorText: { color: "#e53935" },
});

export default Input;
