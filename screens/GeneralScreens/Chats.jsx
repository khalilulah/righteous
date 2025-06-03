import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { COLORS, FONTS } from "../../constants/theme";
import { Button, ConfirmationModal, EmptyStateLayout } from "../../components";
import SingleChat from "./SingleChat";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../utils/socket";
import { useFocusEffect } from "@react-navigation/native";
import { setChatList } from "../../redux/slices/chat/chatSlice";
import { logout } from "../../redux/slices/auth/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { useFetchUsersQuery } from "../../redux/actions/chat/chatsApi";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import GroupChat from "./GroupChat";
import ChatsGroupChat from "./ChatsGroupChat";

const Chats = ({ navigation }) => {
  const [broadcastModalVisible, setBroadcastModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentlySelectedUser, setCurrentlySelectedUser] = useState(null);

  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Action dispatcher
  const dispatch = useDispatch();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [usersListVisible, setUsersListVisible] = useState(false);
  const loggedInUser = useSelector((state) => state.auth?.user);
  const cm = useSelector((state) => state.chatList?.chatList);
  const userId = loggedInUser?._id;
  const storage = getStorage();

  // For fetching users
  const {
    data: users,
    error: errorLoadingUsers,
    isLoading: isLoadingUsers,
    refetch,
  } = useFetchUsersQuery();

  // Toggle user selection for broadcasting
  const toggleUserSelection = (userId) => {
    setCurrentlySelectedUser((prev) => {
      prev === userId ? null : userId;
    });
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    navigation.replace("Login");
  };
  // End of logout function

  // Function to handle file upload
  const uploadFile = async () => {
    try {
      const { uri, name: fileName, mimeType, size } = selectedFile?.assets[0];

      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `chatFiles/${Date.now()}_${fileName}`);

      // Fetch the file and convert to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Upload blob to Firebase Storage
      const snapshot = await uploadBytes(storageRef, blob);

      // Get download URL
      const fileUrl = await getDownloadURL(snapshot.ref);

      return { fileUrl, fileType: mimeType, fileName, size };
    } catch (err) {
      console.error("File upload error:", err);
      setIsUploading(false);
      return null;
    }
  };

  // Function to pick file
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.type !== "cancel") {
        setSelectedFile(result);
      }
    } catch (error) {
      console.log("File picking error:", error);
    }
  };
  // End of function to pick file

  // Send broadcast message
  const handleSendBroadcast = async () => {
    try {
      if (selectedUsers.length > 0) {
        // Handle broadcast here

        socket.emit("get_users", userId);

        if (!selectedFile && !broadcastMessage.trim()) {
          return ToastAndroid.show(
            "Kindly attach a file of type a message!",
            ToastAndroid.SHORT
          );
        }

        let messageData = {
          sender: userId,
          message: broadcastMessage || "",
        };

        if (selectedFile) {
          const fileData = await uploadFile();
          if (!fileData) return;

          messageData.fileUrl = fileData.fileUrl;
          messageData.fileType = fileData.fileType;
          messageData.fileName = fileData.fileName;
          messageData.fileSize = fileData.size;
        }

        const selectedUserChatIds = [];

        for (let index = 0; index < selectedUsers.length; index++) {
          const currentUserId = selectedUsers[index];

          // Check current USERID among the participants of other private chats
          const foundChat = cm?.find((c) => {
            if (c?.type === "private") {
              return c?.participants?.some(
                (participant) => participant?._id === currentUserId
              );
            }
            return false;
          });

          // Push to the array
          selectedUserChatIds?.push({
            chatId: foundChat.chatId,
            userId: currentUserId,
          });
        }
        messageData.recipientIds = selectedUsers;
        messageData.chatIds = selectedUserChatIds;

        socket.emit("broadcast_message", messageData);
        setBroadcastMessage("");
        setBroadcastModalVisible(false);
        setSelectedUsers([]);
      } else {
        return ToastAndroid.show(
          "Kindly select at least one user!",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Set navigation bar styles
    NavigationBar.setBackgroundColorAsync("white");
    NavigationBar.setButtonStyleAsync("dark");

    if (userId) {
      socket.emit("identify_user", userId);

      const handleUserIdentified = () => socket.emit("get_users", userId);
      socket.on("user_identified", handleUserIdentified);

      return () => {
        socket.off("user_identified", handleUserIdentified);
      };
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        socket.emit("get_users", userId);

        const handleSendUsers = (data) => {
          dispatch(setChatList({ chatList: data }));
        };

        socket.on("send_users", handleSendUsers);

        return () => {
          socket.off("send_users", handleSendUsers);
        };
      }
    }, [userId, dispatch])
  );
  useFocusEffect(
    useCallback(() => {
      console.log("Should fetch data 2");
    }, [])
  );
  socket.on("send_users", (data) => dispatch(setChatList({ chatList: data })));

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
            source={require("../../assets/icons/logoMini.png")}
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {cm.length > 0 ? (
            cm.map((chat, index) =>
              chat?.type === "private" ? (
                <SingleChat
                  key={chat._id || index}
                  chat={chat}
                  navigation={navigation}
                  userId={userId}
                  otherUser={chat?.participants?.find(
                    (participant) => participant?._id !== userId
                  )}
                />
              ) : (
                <ChatsGroupChat
                  userId={userId}
                  navigation={navigation}
                  chat={chat}
                  key={chat._id || index}
                />
              )
            )
          ) : (
            <View style={styles.emptyViewContainer}>
              <EmptyStateLayout
                title="Looking for messages?"
                img="noChat"
                supportingText="Conversations will appear here as you start chatting."
              />
            </View>
          )}
        </ScrollView>

        {/* FAB */}
        {loggedInUser?.role === "teacher" && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setBroadcastModalVisible(true)}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        )}

        {/* Broadcast Modal */}
        <Modal
          visible={broadcastModalVisible}
          animationType="slide"
          transparent
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <ScrollView contentContainerStyle={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Broadcast Message</Text>

                {/* Message Input */}
                <TextInput
                  placeholder="Type your message..."
                  value={broadcastMessage}
                  onChangeText={setBroadcastMessage}
                  style={styles.messageInput}
                  multiline
                />

                {/* Attach File */}
                <Button onPress={pickFile} width="120">
                  Attach File
                </Button>
                {selectedFile && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.attachedFileText}>
                      Attached: {selectedFile?.assets?.[0]?.name}
                    </Text>
                    <TouchableOpacity onPress={() => setSelectedFile(null)}>
                      <MaterialIcons
                        name="delete"
                        size={16}
                        color={COLORS.error}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Toggle User List */}
                <TouchableOpacity
                  onPress={() => setUsersListVisible(!usersListVisible)}
                  style={styles.userListToggle}
                >
                  <Text style={styles.userListToggleText}>
                    {usersListVisible ? "Hide User List ▲" : "Select Users ▼"}
                  </Text>
                </TouchableOpacity>

                {/* User List (Collapsible) */}
                {usersListVisible && (
                  <View style={{ flex: 1, maxHeight: 200 }}>
                    <FlatList
                      data={users?.data}
                      scrollEnabled={false}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => toggleUserSelection(item._id)}
                          style={[
                            styles.userItem,
                            selectedUsers.includes(item._id) &&
                              styles.userItemSelected,
                          ]}
                        >
                          <Text style={styles.userText}>
                            {item?.firstname} {item?.surname}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <Button onPress={handleSendBroadcast}>Send</Button>
                  <Button
                    variant="outlined"
                    onPress={() => setBroadcastModalVisible(false)}
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Chats;

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
});
