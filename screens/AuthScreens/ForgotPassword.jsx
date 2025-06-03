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
import { useSendOtpMutation } from "../../redux/actions/auth/authApi";

const ForgotPasswordScreen = ({ navigation }) => {
  const [sendOtp, { isLoading }] = useSendOtpMutation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    try {
      if (!email) {
        ToastAndroid.show(
          "Please enter your email address",
          ToastAndroid.SHORT
        );
        return;
      }

      await sendOtp({ email }).unwrap();
      ToastAndroid.show("OTP successfully sent", ToastAndroid.SHORT);

      setTimeout(() => {
        //   Navigate to the ResetPassword screen
        navigation.navigate("ResetPassword", { email });
      }, 200);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar with Back Navigation */}
      <TopBarBackNavigation navigation={navigation}>
        {"Go Back"}
      </TopBarBackNavigation>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Forgot Password Intro Layout (Logo, Title and supporting text) */}
        <AuthIntroLayout
          title={"Forgot Password"}
          supportingText={
            "Enter your registered email address. An OTP will be sent to verify your account."
          }
        />

        <View style={styles.inputContainer}>
          {/* Email Input */}
          <Input
            label="Email address"
            onChangeText={setEmail}
            value={email}
            type="email-address"
            placeholder="Enter your email"
          />
        </View>

        {/* CTA - Send OTP */}
        <Button onPress={handleSendOTP} disabled={isLoading}>
          {isLoading ? "Sending OTP..." : "Send OTP"}
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

export default ForgotPasswordScreen;
