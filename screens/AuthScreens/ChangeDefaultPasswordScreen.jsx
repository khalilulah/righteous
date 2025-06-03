import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AuthIntroLayout,
  Button,
  Input,
  TopBarBackNavigation,
} from "../../components";
import { COLORS } from "../../constants/theme";
import { useChangeDefaultPasswordMutation } from "../../redux/actions/auth/authApi";

const ChangeDefaultPasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [changeDefaultPassword, { isLoading }] =
    useChangeDefaultPasswordMutation();

  const handleChangePassword = async () => {
    try {
      if (!oldPassword || !newPassword || !confirmNewPassword) {
        ToastAndroid.show("Please fill in all fields", ToastAndroid.SHORT);
        return;
      }
      if (newPassword !== confirmNewPassword) {
        ToastAndroid.show("Passwords do not match", ToastAndroid.SHORT);
        return;
      }

      await changeDefaultPassword({
        oldPassword,
        newPassword,
        confirmNewPassword,
      }).unwrap();

      ToastAndroid.show("Password successfully changed", ToastAndroid.SHORT);

      setTimeout(() => {
        //   Navigate home
        navigation.replace("Login");
      }, 200);
    } catch (error) {
      const errorMewssage = error?.data?.message;

      console.error("Error changing default password", error);
      ToastAndroid.show(
        `${errorMewssage || "Error changing default password"}`,
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBarBackNavigation navigation={navigation}>
        {"Go Back"}
      </TopBarBackNavigation>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <AuthIntroLayout
          title={"Change Default Password"}
          supportingText={
            "You need to change your default password to continue. Enter your old password and set a new one."
          }
        />

        <View style={styles.inputContainer}>
          <Input
            label="Old Password"
            onChangeText={setOldPassword}
            value={oldPassword}
            placeholder="Enter old password"
            type="password"
          />
          <Input
            label="New Password"
            onChangeText={setNewPassword}
            value={newPassword}
            placeholder="Enter new password"
            type="password"
          />
          <Input
            label="Confirm New Password"
            onChangeText={setConfirmNewPassword}
            value={confirmNewPassword}
            placeholder="Confirm new password"
            type="password"
          />
        </View>

        <Button onPress={handleChangePassword} disabled={isLoading}>
          {isLoading ? "Changing Password..." : "Change Password"}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 24,
  },
  inputContainer: {
    width: "100%",
    gap: 12,
  },
});

export default ChangeDefaultPasswordScreen;
