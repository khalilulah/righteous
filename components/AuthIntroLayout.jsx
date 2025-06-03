import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const AuthIntroLayout = ({ title, supportingText }) => {
  return (
    <>
      {/* Logo */}
      <Image
        style={styles.loginImage}
        source={require("../assets/icons/logo.png")}
      />

      {/* Screen Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Supporting Text */}
      <Text style={styles.supportingText}>{supportingText}</Text>
    </>
  );
};

export default AuthIntroLayout;

const styles = StyleSheet.create({
  loginImage: {
    resizeMode: "contain",
    height: 150,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 500,
    fontFamily: "Suse-Bold",
  },
  supportingText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
    fontFamily: "Suse-Regular",
  },
});
