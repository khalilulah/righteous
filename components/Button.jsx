import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { COLORS } from "../constants/theme";

const Button = ({
  children,
  variant = "contained",
  size = "medium",
  startIcon,
  endIcon,
  disabled = false,
  loading = false,
  onPress,
  width = "100%",
  ...props
}) => {
  // Styles for button variant
  const variantStyles = {
    contained: styles.contained,
    danger: styles.danger,
    outlined: styles.outlined,
    text: styles.text,
  }[variant];

  // Styles for button size
  const sizeStyles = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  }[size];

  const buttonStyles = [
    styles.button,
    variantStyles,
    sizeStyles,
    disabled && styles.disabled,
    { width },
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={!disabled && !loading ? onPress : null}
      activeOpacity={0.7}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <View style={styles.content}>
          {startIcon && <View style={styles.icon}>{startIcon}</View>}
          <Text
            style={[
              styles.textLabel,
              variant === "outlined" && styles.textOutlined,
            ]}
          >
            {children}
          </Text>
          {endIcon && <View style={styles.icon}>{endIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  contained: { backgroundColor: COLORS.primary },
  danger: { backgroundColor: COLORS.error },
  outlined: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: "transparent",
  },
  text: { backgroundColor: "transparent" },
  small: { height: 40, paddingVertical: 8 },
  medium: { height: 48, paddingVertical: 10 },
  large: { height: 56, paddingVertical: 12 },
  textLabel: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Suse-Bold",
    fontWeight: 600,
  },
  textOutlined: { color: COLORS.primary },
  disabled: { opacity: 0.5 },
  content: { flexDirection: "row", alignItems: "center" },
  icon: { marginHorizontal: 5 },
});

export default Button;
