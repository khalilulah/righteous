import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Linking,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  DocumentPreview,
  ImageViewerModal,
  TopBarBackNavigation,
} from "../../components";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "../../utils/firebaseConfig";
import { BASE_URL, SOCKET_BASE_URL } from "../../utils/utilFunctions";
import {
  chatsApi,
  useFetchChatsQuery,
} from "../../redux/actions/chat/chatsApi";
import { socket } from "../../utils/socket";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  setChatList,
  setMessages,
} from "../../redux/slices/chat/chatSlice";
import * as DocumentPicker from "expo-document-picker";
import { ActivityIndicator } from "react-native";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import moment from "moment";

const ChatScreen = ({ route, navigation }) => {
  const { chatId, name, userId, receiverId } = route.params; // Extract passed data
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages[chatId] || []);
  const [currentMessage, setCurrentMessage] = useState("");
  const flatListRef = useRef(null); // Create a ref for the FlatList
  const storage = getStorage();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileDetails, setSelectedFileDetails] = useState({
    fileName: "",
    fileSize: null,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    return moment(timestamp).format("h:mm A"); // E.g., "4:30 PM"
  };

  useEffect(() => {
    // Fetch messages using RTK Query
    dispatch(
      chatsApi.endpoints.fetchChats.initiate(
        { chatId },
        { forceRefetch: true } // This option bypasses the cache
      )
    )
      .unwrap()
      .then((data) => {
        dispatch(setMessages({ chatId, messages: data.data }));
      });
  }, [chatId, dispatch]);

  useEffect(() => {
    // Set status bar color
    StatusBar.setBarStyle("dark-content"); // For both iOS and Android
    StatusBar.setBackgroundColor("#ffffff"); // Android only

    // Listen for incoming messages
    socket.on("receive_message", (message) => {
      dispatch(addMessage({ chatId, message }));
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // Function to handle file upload
  const uploadFile = async () => {
    try {
      setIsUploading(true);

      // Pick a file
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
      });

      if (result.canceled) {
        setIsUploading(false);
        return null;
      }

      const { uri, name: fileName, mimeType, size } = result.assets[0];
      setSelectedFileDetails({ fileName, fileSize: size });

      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `chatFiles/${Date.now()}_${fileName}`);

      // Fetch the file and convert to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Upload blob to Firebase Storage
      const snapshot = await uploadBytes(storageRef, blob);

      // Get download URL
      const fileUrl = await getDownloadURL(snapshot.ref);

      setIsUploading(false);
      return { fileUrl, fileType: mimeType };
    } catch (err) {
      console.error("File upload error:", err);
      setIsUploading(false);
      return null;
    }
  };

  // Function to handle message send
  const handleSend = async (isFile = false) => {
    socket.emit("get_users", userId);

    if (!isFile && !currentMessage.trim()) {
      return;
    }

    let messageData = {
      sender: userId,
      chatId,
      message: currentMessage || "",
    };

    if (isFile) {
      const fileData = await uploadFile();
      if (!fileData) return;

      messageData.fileUrl = fileData.fileUrl;
      messageData.fileType = fileData.fileType;
      messageData.fileName = selectedFileDetails.fileName;
      messageData.fileSize = selectedFileDetails.fileSize;
    }

    socket.emit("send_message", messageData);
    // dispatch(addMessage({ chatId, message: messageData }));
    setCurrentMessage("");
  };

  // End of function to handle message send

  useEffect(() => {
    // Join chat room
    socket.emit("join_chat", { chatId, userId });

    return () => {
      // Leave the room when the screen is closed
      socket.emit("leave_chat", chatId);
    };
  }, [chatId]);

  const renderMessageItem = ({ item, index }) => {
    const prevMessage = [...messages]?.reverse()[1 + index];

    const showDateHeader =
      !prevMessage ||
      moment(item.timestamp).format("LL") !==
        moment(prevMessage?.timestamp).format("LL");

    return (
      <>
        {showDateHeader && (
          <Text
            style={{ alignSelf: "center", marginVertical: 5, color: "#888" }}
          >
            {moment(item.timestamp).calendar(null, {
              sameDay: "[Today]",
              lastDay: "[Yesterday]",
              lastWeek: "dddd, MMM D",
              sameElse: "MMMM D, YYYY",
            })}
          </Text>
        )}
        <View
          style={{
            padding: 8,
            backgroundColor: item.sender === userId ? "#d1ddff" : "#ffffff",
            alignSelf: item.sender === userId ? "flex-end" : "flex-start",
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          {item.message && <Text>{item.message}</Text>}
          {item.fileUrl && item.fileType.includes("image") ? (
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(item.fileUrl);
                setImageViewerVisible(true);
              }}
            >
              <Image
                source={{ uri: item.fileUrl }}
                style={{ width: 200, height: 200, borderRadius: 8 }}
              />
            </TouchableOpacity>
          ) : item.fileUrl ? (
            <DocumentPreview
              fileUrl={item.fileUrl}
              fileType={item.fileType}
              fileName={item.fileName}
              fileSize={item.fileSize}
              item={item}
            />
          ) : null}

          <Text style={{ fontSize: 10, color: "#888", marginTop: 5 }}>
            {formatTimestamp(item.timestamp)}
            {item.sender === userId && (
              <Text style={{ fontWeight: "bold", marginLeft: 5 }}>
                {item.status === "read"
                  ? " ✓✓"
                  : item.status === "delivered"
                  ? " ✓"
                  : " ⏳"}
              </Text>
            )}
          </Text>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <TopBarBackNavigation
        navigation={navigation}
        customStyle={{
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Text style={styles.headerTitle}>{name}</Text>
      </TopBarBackNavigation>

      {/* Chat List */}
      <View style={styles.chatListContainer}>
        {messages.length > 0 ? (
          <FlatList
            data={[...messages].reverse()} // Reverse messages so the newest appears at the bottom
            ref={flatListRef}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            inverted
            renderItem={renderMessageItem}
          />
        ) : (
          <View style={styles.emptyChatPlaceholder} />
        )}
      </View>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={() => handleSend(true)}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Ionicons name="attach" size={24} color="black" />
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={currentMessage}
          onChangeText={(text) => setCurrentMessage(text)}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => handleSend(false)}
          disabled={isUploading}
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Image viewer */}
      <ImageViewerModal
        visible={imageViewerVisible}
        imageUrl={selectedImage}
        onClose={() => {
          setImageViewerVisible(false);
          setSelectedImage(null);
        }}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f8",
  },
  chatListContainer: {
    flex: 1, // This allows the list to take up all available space
    padding: 8,
  },
  emptyChatPlaceholder: {
    flex: 1, // Pushes the input field to the bottom when no messages exist
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Suse-Bold",
  },
  chatContainer: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "white",
  },
  input: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "white",
    marginRight: 8,
  },
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
  sender: { fontWeight: "bold" },
  message: { marginTop: 2 },
  sendButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#007bff", // Adjust to your theme color
    justifyContent: "center",
    alignItems: "center",
  },
});
