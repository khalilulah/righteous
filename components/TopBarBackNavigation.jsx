import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "../constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";

const TopBarBackNavigation = ({ navigation, children, customStyle }) => {
  return (
    <View style={customStyle || styles.topBar}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.container}
      >
        <Ionicons
          style={styles.iconImage}
          name="chevron-back-outline"
          size={16}
        />
        <Text style={styles.backButton}>{children}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TopBarBackNavigation;

const styles = StyleSheet.create({
  backButton: {
    fontSize: 16,
    color: COLORS.primary,
    fontFamily: "Suse-SemiBold",
    lineHeight: 30,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  topBar: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  iconImage: { color: COLORS.primary },
});
