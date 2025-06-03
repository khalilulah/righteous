import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  Image,
  ScrollView,
} from "react-native";
import axios from "axios";
import { COLORS } from "../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthIntroLayout, Button, Input } from "../components";
import { useLoginMutation } from "../redux/actions/auth/authApi";

const LoginScreen = ({ navigation }) => {
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     ToastAndroid.show("Please fill in all fields", ToastAndroid.SHORT);
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const response = await axios.post(
  //       "http://192.168.0.102:8082/api/users/login",
  //       {
  //         email,
  //         password,
  //       }
  //     );

  //     const { user, token } = response.data;

  //     if (user.role === "parent") {
  //       navigation.replace("ParentScreen", { user, token });
  //     } else if (user.role === "teacher") {
  //       navigation.replace("TeacherScreen", { user, token });
  //     } else {
  //       ToastAndroid.show("Invalid user role", ToastAndroid.SHORT);
  //     }
  //   } catch (error) {
  //     ToastAndroid.show("Login failed. Please try again.", ToastAndroid.SHORT);
  //     console.error("Login error:", error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleLogin = async () => {
    try {
      if (!email || !password) {
        ToastAndroid.show("Please fill in all fields", ToastAndroid.SHORT);
        return;
      }

      const loginResponse = await login({ email, password }).unwrap();

      if (loginResponse?.data?.action === "changeDefaultPassword") {
        navigation.navigate("ChangeDefaultPassword");
      } else {
        ToastAndroid.show("Login successful", ToastAndroid.SHORT);

        console.log(loginResponse?.data);

        setTimeout(() => {
          //   Navigate home if the logged in user is not a guadian else navigate to institution list screen
          loginResponse?.data?.role === "guardian"
            ? navigation.replace("InstitutionList")
            : navigation.replace("MainApp");
        }, 200);
      }
    } catch (error) {
      const errorMewssage = error?.data?.message;

      console.error("Error logging in", error);
      ToastAndroid.show(
        `${errorMewssage || "Error logging in"}`,
        ToastAndroid.SHORT
      );
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Forgot Password Intro Layout (Logo, Title and supporting text) */}
        <AuthIntroLayout
          title={"Login to your account"}
          supportingText={
            "Enter your registered email address and password to continue."
          }
        />

        <View style={styles.inputContainer}>
          {/* Email Input */}
          <Input
            label={"Email address"}
            onChangeText={setEmail}
            type="email-address"
          />

          {/* Password Input */}
          <Input
            label={"Password"}
            type="password"
            value={password}
            onChangeText={setPassword}
          />

          {/* Forgot Password */}
          <View style={styles.forgotPasswordContainer}>
            <Text
              style={styles.forgotPasswordText}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              Forgot Password?
            </Text>
          </View>
        </View>

        {/* CTA - (Login) */}
        <Button onPress={handleLogin} disabled={isLoading}>
          {" "}
          {isLoading ? "Please wait ..." : "Login"}
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
  keyboardAvoidingContainer: {
    flex: 1,
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
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    marginBottom: 20,
    fontFamily: "Suse-Bold",
  },
  loginImage: {
    resizeMode: "contain",
    height: 200,
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    color: COLORS.primary,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontFamily: "Suse-SemiBold",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;

// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import axios from 'axios';
// import Toast from 'react-native-toast-message';

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   console.log("dsrtf");

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Toast.show({
//         type: 'error',
//         text1: 'Validation Error',
//         text2: 'All fields are required',
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.post('http://192.168.0.102:8082/api/users/login', {
//         email,
//         password,
//       });

//       const { token, user } = response.data;

//       Toast.show({
//         type: 'success',
//         text1: 'Login Successful',
//         text2: `Welcome back, ${user.name}!`,
//       });

//       setLoading(false);

//       // Navigate to Home Screen
//       navigation.navigate('Home', { user, token });
//     } catch (error) {
//       setLoading(false);

//       // Determine error message
//       const errorMessage =
//         error.response?.data?.message || 'An error occurred. Please try again.';

//       // Log the error for debugging
//       console.error('Login error:', error);

//       // Display error message as a toast
//       Toast.show({
//         type: 'error',
//         text1: 'Login Failed',
//         text2: errorMessage,
//       });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         value={email}
//         onChangeText={setEmail}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleLogin}
//         disabled={loading}
//       >
//         <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
//       </TouchableOpacity>

//       {/* Toast Component */}
//       <Toast position="top" visibilityTime={3000} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 32,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   button: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#007bff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default LoginScreen;

// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import axios from 'axios';

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'All fields are required');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.post('http://192.168.0.102:8082/api/users/login', {
//         email,
//         password,
//       });

//       const { token, user } = response.data;

//       Alert.alert('Success', `Welcome ${user.name}`);
//       setLoading(false);

//       // Navigate based on user role
//       if (user.role === 'teacher') {
//         navigation.navigate('TeacherScreen', { user, token });
//       } else if (user.role === 'parent') {
//         navigation.navigate('ParentScreen', { user, token });
//       } else {
//         Alert.alert('Error', 'Unrecognized role. Please contact support.');
//       }
//     } catch (error) {
//       setLoading(false);
//       const errorMessage =
//         error.response?.data?.message || 'An error occurred. Please try again.';
//       Alert.alert('Login Failed', errorMessage);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         value={email}
//         onChangeText={setEmail}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleLogin}
//         disabled={loading}
//       >
//         <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 32,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   button: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#007bff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default LoginScreen;

// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import axios from 'axios';

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'All fields are required');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.post('http://192.168.0.102:8081/api/users/login', {
//         email,
//         password,
//       });

//       const { token, user } = response.data;
//       Alert.alert('Success', `Welcome ${user.name}`);
//       setLoading(false);

//       // Navigate to Home Screen
//       navigation.navigate('Home', { user, token });
//     } catch (error) {
//       setLoading(false);
//       const errorMessage =
//         error.response?.data?.message || 'An error occurred. Please try again.';
//       Alert.alert('Login Failed', errorMessage);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         value={email}
//         onChangeText={setEmail}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleLogin}
//         disabled={loading}
//       >
//         <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 32,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   button: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#007bff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default LoginScreen;
