import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { COLORS, FONTS } from "../constants/theme";
import { useDispatch, useSelector } from "react-redux";
import { ConfirmationModal, EmptyStateLayout } from "../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout } from "../redux/slices/auth/authSlice";
import { useGetInstitutionsMutation } from "../redux/actions/auth/authApi";

const ParentScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [getInstitutions, { isLoading, data }] = useGetInstitutionsMutation();

  // For fetching institutions

  // Action dispatcher
  const dispatch = useDispatch();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const loggedInUser = useSelector((state) => state.auth?.user);
  const cm = useSelector((state) => state.chatList?.chatList);

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    navigation.replace("Login");
  };
  // End of logout function

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

  useEffect(() => {
    // Fetch institutions
    const fetchInstitutions = async () => {
      try {
        await getInstitutions(loggedInUser?.teachers).unwrap();
      } catch (error) {
        console.log(error);
      }
    };

    fetchInstitutions();
  }, []);

  console.log(data);

  return (
    <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
      <SafeAreaView style={styles.container}>
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

        {/* Main Body */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Show if loading */}
          {isLoading && <Text>Loading ...</Text>}

          {/* Show if there's no organisation */}
          {data?.data?.length === 0 && (
            <View style={styles.emptyViewContainer}>
              <EmptyStateLayout
                title="No institution"
                img="noChat"
                supportingText="Institution list will appear here"
              />
            </View>
          )}

          {/* Show if there is organisation */}
          <ScrollView>
            {data?.data?.map((datum, index) => {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate("MainApp")}
                  style={styles.institutionContainer}
                  key={index}
                >
                  {/* Profile Image */}
                  <Image
                    source={{ uri: datum?.organization?.logo }}
                    style={styles.profileImage}
                  />

                  {/* Name and chat */}
                  <View style={styles.mainChatItem}>
                    <Text style={styles.mainChatItemTitle}>
                      {datum?.organization?.name}
                    </Text>
                    {datum?.organization?.location && (
                      <Text style={styles.mainChatItemSupport}>
                        {datum?.organization?.location}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </ScrollView>

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
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50, // makes it perfectly round (50% of width/height)
    resizeMode: "cover",
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
    padding: 16,
    paddingTop: 40,
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
  },
  dropdownItem: { paddingVertical: 5, paddingHorizontal: 15, width: 120 },
  dropdownText: { fontSize: 14, fontWeight: "500", fontFamily: "Suse-Bold" },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 10,
    fontFamily: "Suse-Bold",
  },
  messageInput: {
    borderWidth: 1,
    padding: 10,
    height: 120, // Fixed height
    textAlignVertical: "top", // Ensures text starts from the top
    marginBottom: 10,
    borderRadius: 12,
    fontFamily: "Suse-Regular",
    borderColor: COLORS.lightGray,
  },
  attachedFileText: {
    fontSize: 14,
    fontFamily: "Suse-SemiBold",
    marginVertical: 5,
    flex: 1,
  },
  userListToggle: {
    marginTop: 20,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  userListToggleText: {
    fontSize: 16,
    fontFamily: "Suse-Bold",
  },
  userList: {
    marginTop: 10,
    maxHeight: 200, // Limits height to allow scrolling
  },
  userItem: {
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  userItemSelected: {
    backgroundColor: "lightgray",
  },
  userText: {
    fontFamily: "Suse-SemiBold",
  },
  buttonContainer: {
    gap: 10,
    marginTop: 30,
  },
  institutionContainer: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    gap: 8,
  },
  profile: {
    height: 50,
    width: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCE6E9",
    borderRadius: "50%",
  },
  profileText: {
    fontFamily: "Suse-SemiBold",
    fontSize: FONTS.medium,
  },
  mainChatItem: {
    flex: 1,
    paddingTop: 4,
  },
  notificationItem: {
    flex: 1,
    padding: 4,
    backgroundColor: COLORS.primary,
  },
  mainChatItemTitle: {
    fontFamily: "Suse-SemiBold",
    fontSize: FONTS.medium,
    fontWeight: 600,
  },
  mainChatItemSupport: {
    fontFamily: "Suse-SemiBold",
    fontSize: FONTS.small,
    fontWeight: 600,
    color: COLORS.darkGray,
  },

  rhsContainer: {
    justifyContent: "space-between",
  },

  time: {
    fontFamily: "Suse-SemiBold",
    paddingTop: 4,
    fontSize: FONTS.small,
    fontWeight: 600,
    color: COLORS.primary,
  },
  unreadBadge: {
    backgroundColor: "red",
    borderRadius: 12,
    // paddingHorizontal: 8,
    width: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    // paddingVertical: 2,
    marginTop: 4,
  },
  unreadText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  rightSection: {
    alignItems: "flex-end",
  },
});

export default ParentScreen;
