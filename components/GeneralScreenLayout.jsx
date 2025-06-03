import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationModal from "./ConfirmationModal";
import { logout } from "../redux/slices/auth/authSlice";

const GeneralScreenLayout = ({ navigation, children }) => {
  // Action dispatcher
  const dispatch = useDispatch();

  // Modal visibility state
  const [modalVisible, setModalVisible] = useState(false);

  const loggedInUser = useSelector((state) => state.auth?.user);

  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    navigation.replace("Login");
  };
  // End of logout function

  useEffect(() => {
    // Set navigation bar styles
    NavigationBar.setBackgroundColorAsync("white");
    NavigationBar.setButtonStyleAsync("dark");
  }, []);

  // Memoized function to avoid unnecessary re-renders
  const parseText = useMemo(() => {
    return (text) => {
      const roleMapping = {
        superAdmin: "Super Admin",
        teacher: "Teacher",
        guardian: "Guardian",
      };
      return roleMapping[text] || text;
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
      <SafeAreaView style={styles.container}>
        {/* Logout confirmation modal */}
        <ConfirmationModal
          visible={modalVisible}
          message={`Are you sure you want to logout?`}
          onConfirm={handleLogout}
          onCancel={() => {
            setModalVisible(false);
            setDropdownVisible(false);
          }}
        />

        {/* Header */}
        <View style={styles.topBar}>
          <Image
            style={styles.loginImage}
            source={require("../assets/icons/logoMini.png")}
          />

          {/* User details */}
          <TouchableOpacity
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <View>
              <Text style={styles.roleText}>
                {parseText(loggedInUser?.role)}
              </Text>
              <Text style={styles.nameText}>
                {loggedInUser?.firstname} {loggedInUser?.surname}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Dropdown */}
        {dropdownVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Main Body */}
        {children}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default GeneralScreenLayout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  topBar: {
    padding: 16,
    paddingTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roleText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Suse-Bold",
    textAlign: "right",
  },
  nameText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Suse-Regular",
    textAlign: "right",
  },
  loginImage: {
    resizeMode: "contain",
    height: 30,
  },
  emptyViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  scrollContainer: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    flexGrow: 1,
  },
  dropdownMenu: {
    position: "absolute",
    top: 80,
    right: 16,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 2,
  },
  dropdownItem: { paddingVertical: 5, paddingHorizontal: 15, width: 120 },
  dropdownText: { fontSize: 14, fontWeight: "500", fontFamily: "Suse-Bold" },
});
