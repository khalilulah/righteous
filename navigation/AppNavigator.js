import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "./AuthContext";
import TeacherScreen from "./screens/TeacherScreen";
import ParentScreen from "./screens/ParentScreen";
import LoginScreen from "./screens/LoginScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { role, isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : role === "teacher" ? (
          <Stack.Screen name="Teacher Dashboard" component={TeacherScreen} />
        ) : (
          <Stack.Screen name="Parent Dashboard" component={ParentScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
