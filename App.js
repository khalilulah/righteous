import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Toast from "react-native-toast-message";
import { SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { useSelector } from "react-redux";

// Screen imports
import {
  TeacherScreen,
  LoginScreen,
  ParentScreen,
  HomeScreen,
} from "./screens";
import {
  ChangeDefaultPasswordScreen,
  ForgotPassword,
  ResetPasswordScreen,
} from "./screens/AuthScreens";
import { MainAppNavigator } from "./navigation";
import { ChatScreen } from "./screens/GeneralScreens";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GroupDetails } from "./screens/TeacherScreens";

// Font configuration
const FONT_CONFIG = {
  "Suse-Bold": require("./assets/fonts/suse/SUSE-Bold.ttf"),
  "Suse-SemiBold": require("./assets/fonts/suse/SUSE-SemiBold.ttf"),
  "Suse-Medium": require("./assets/fonts/suse/SUSE-Medium.ttf"),
  "Suse-Regular": require("./assets/fonts/suse/SUSE-Regular.ttf"),
  "Suse-Light": require("./assets/fonts/suse/SUSE-Light.ttf"),
  "Suse-Thin": require("./assets/fonts/suse/SUSE-Thin.ttf"),
};

// Toast configuration
const TOAST_CONFIG = {
  position: "top",
  visibilityTime: 3000,
  autoHide: true,
  topOffset: 50,
  bottomOffset: 40,
};

// Screen configuration for the navigator
const SCREEN_CONFIG = [
  {
    name: "Login",
    component: LoginScreen,
    options: { headerShown: false },
  },
  {
    name: "ForgotPassword",
    component: ForgotPassword,
    options: { headerShown: false },
  },
  {
    name: "ResetPassword",
    component: ResetPasswordScreen,
    options: { headerShown: false },
  },
  {
    name: "ChangeDefaultPassword",
    component: ChangeDefaultPasswordScreen,
    options: { headerShown: false },
  },
  {
    name: "TeacherScreen",
    component: TeacherScreen,
    options: {},
  },
  {
    name: "ParentScreen",
    component: ParentScreen,
    options: {},
  },
  {
    name: "InstitutionList",
    component: ParentScreen,
    options: { headerShown: false },
  },
  {
    name: "Home",
    component: HomeScreen,
    options: {},
  },
  {
    name: "MainApp",
    component: MainAppNavigator,
    options: { headerShown: false },
  },

  // Single Chat screen
  {
    name: "ChatScreen",
    component: ChatScreen,
    options: { headerShown: false },
  },
  // Groupchat Management screen
  {
    name: "GroupDetails",
    component: GroupDetails,
    options: { headerShown: false },
  },
];

const Stack = createStackNavigator();

/**
 * Main App component that sets up navigation, fonts, and global toast notifications
 * @component
 * @returns {React.ReactElement} The rendered App component
 */
const App = () => {
  // Load custom fonts and handle splash screen
  const [fontsLoaded, error] = useFonts(FONT_CONFIG);

  const isUserLoggedIn = useSelector((state) => !!state.auth?.user);
  const userLoggedIn = useSelector((state) => state.auth?.user);

  useEffect(() => {
    const handleInitialization = async () => {
      try {
        // Prevent splash screen from auto-hiding
        await SplashScreen.preventAutoHideAsync();

        if (error) throw error;
        if (fontsLoaded) {
          // Hide splash screen once fonts are loaded
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.error("Error during app initialization:", e);
        // Handle initialization errors appropriately
      }
    };

    handleInitialization();
  }, [fontsLoaded, error]);

  // Return null while fonts are loading and there's no error
  if (!fontsLoaded && !error) return null;

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={
            isUserLoggedIn
              ? userLoggedIn?.role === "guardian"
                ? "InstitutionList"
                : "MainApp"
              : "Login"
          }
        >
          {SCREEN_CONFIG.map(({ name, component, options }) => (
            <Stack.Screen
              key={name}
              name={name}
              component={component}
              options={options}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast {...TOAST_CONFIG} />
    </>
  );
};

export default App;
