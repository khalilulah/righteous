import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome } from "@expo/vector-icons"; // Optional for icons
import { Chats, Profile } from "../screens/GeneralScreens";
import { COLORS } from "../constants/theme";
import { useDispatch, useSelector } from "react-redux";
import { ManageGroups, ManageGuardiansScreen } from "../screens/TeacherScreens";
import { ManageRequests } from "../screens/GuardianScreens";
import { incrementUnreadRequests } from "../redux/slices/guardian/requestSlice";
import { socket } from "../utils/socket";
import ManageTeachersScreen from "../screens/OrganisationAdminScreens/ManageTeachechersScreen"

const Tab = createBottomTabNavigator();

const MainAppNavigator = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth?.user);
  const userRole = loggedInUser?.role;
  const requestCount =
    useSelector((state) => state.requests.unreadRequests) || null;

  useEffect(() => {
    // Listen for new request notifications
    socket.on("new_request", () => {
      dispatch(incrementUnreadRequests());
    });

    return () => {
      socket.off("new_request");
    };
  }, [dispatch]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "white", // Background color of the tab bar
          shadowColor: "transparent",
          height: 60,
          borderColor: COLORS.lightGray,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12, // Font size for labels
          fontWeight: "600", // Font weight for labels
          fontFamily: "Suse-SemiBold",
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.darkGray,
        headerShown: false,
      })}
    >
      {/* Common Tabs */}
      {userRole !== "organizationAdmin" && (
        <>
        <Tab.Screen
        name="Chats"
        component={Chats}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons
                name={"chatbubbles-sharp"}
                size={24}
                color={COLORS.primary}
              />
            ) : (
              <Ionicons
                name={"chatbubbles-outline"}
                size={24}
                color={COLORS.darkGray}
              />
            ),
        }}
      />
        </>
      )
      }
      

      {/* Conditional Tabs for Teachers */}
      {userRole === "teacher" && (
        <>
          <Tab.Screen
            name="Manage Guardians"
            component={ManageGuardiansScreen} // Replace with the actual screen for managing guardians
            options={{
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <Ionicons
                    name="people-sharp"
                    size={24}
                    color={COLORS.primary}
                  />
                ) : (
                  <Ionicons
                    name="people-outline"
                    size={24}
                    color={COLORS.darkGray}
                  />
                ),
            }}
          />
          <Tab.Screen
            name="Manage Groups"
            component={ManageGroups} // Replace with actual group management screen
            options={{
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <Ionicons
                    name="layers-sharp"
                    size={24}
                    color={COLORS.primary}
                  />
                ) : (
                  <Ionicons
                    name="layers-outline"
                    size={24}
                    color={COLORS.darkGray}
                  />
                ),
            }}
          />
        </>
      )}

      {/* Conditional Tabs for Organization Admin */}
      {userRole === "organizationAdmin" && (
        <>
          <Tab.Screen
            name="Manage Teachers"
            component={ManageTeachersScreen} // Replace with the actual screen for managing guardians
            options={{
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <Ionicons
                    name="people-sharp"
                    size={24}
                    color={COLORS.primary}
                  />
                ) : (
                  <Ionicons
                    name="people-outline"
                    size={24}
                    color={COLORS.darkGray}
                  />
                ),
            }}
          />
        </>
      )}

      {/* Conditional tabs */}
      {userRole === "guardian" && (
        <Tab.Screen
          name="Requests"
          component={ManageRequests} // Replace with actual parent dashboard screen
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person-add" size={24} color={COLORS.primary} />
              ) : (
                <Ionicons
                  name="person-add-outline"
                  size={24}
                  color={COLORS.darkGray}
                />
              ),
            tabBarBadge: requestCount,
            tabBarBadgeStyle: {
              color: "white",
              fontSize: 10,
              fontWeight: "500",
              fontFamily: "Suse-Bold",
              backgroundColor: COLORS.error,
              left: 22,
              width: 18,
              height: 18,
            },
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default MainAppNavigator;
