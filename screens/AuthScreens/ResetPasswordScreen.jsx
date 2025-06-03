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
import { useResetPasswordMutation } from "../../redux/actions/auth/authApi";

const ResetPasswordScreen = ({ navigation, route }) => {
  const { email } = route?.params;
  console.log(email);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleResetPassword = async () => {
    try {
      if (!newPassword || !confirmNewPassword || !otp) {
        ToastAndroid.show("Please fill in all fields", ToastAndroid.SHORT);
        return;
      }
      if (newPassword !== confirmNewPassword) {
        ToastAndroid.show("Passwords do not match", ToastAndroid.SHORT);
        return;
      }
      console.log(email);
      await resetPassword({
        verificationCode: otp,
        newPassword,
        confirmNewPassword,
        email,
      }).unwrap();

      ToastAndroid.show("Password reset successful", ToastAndroid.SHORT);

      setTimeout(() => {
        //   Navigate home
        navigation.replace("Login");
      }, 200);
    } catch (error) {
      const errorMewssage = error?.data?.message;

      console.error("Error resetting password", error);
      ToastAndroid.show(
        `${errorMewssage || "Error resetting password"}`,
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
          title={"Reset Password"}
          supportingText={
            "Enter the OTP sent to your email and set a new password."
          }
        />

        <View style={styles.inputContainer}>
          <Input
            label="OTP"
            onChangeText={setOtp}
            value={otp}
            placeholder="Enter OTP"
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

        <Button onPress={handleResetPassword} disabled={isLoading}>
          {isLoading ? "Resetting Password..." : "Reset Password"}
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

export default ResetPasswordScreen;
