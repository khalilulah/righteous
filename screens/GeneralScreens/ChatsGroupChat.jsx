import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "../../constants/theme";
import { format, isToday, isYesterday } from "date-fns";

const ChatsGroupChat = ({ navigation, chat, userId }) => {
  const formatTime = (time) => {
    const date = new Date(time);

    if (isToday(date)) {
      return format(date, "hh:mm a"); // Show time if today
    } else if (isYesterday(date)) {
      return "Yesterday"; // Show "Yesterday" if sent yesterday
    } else {
      return format(date, "dd/MM/yyyy"); // Show date for older messages
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ChatScreen", {
            chatId: chat?.chatId,
            name: chat?.name,
            userId,
          })
        }
        style={styles.container}
      >
        {/* Profile Image */}
        {/* Name and chat */}
        <View style={styles.profile}>
          <Text style={styles.profileText}>
            {chat?.name ? chat?.name[0]?.toUpperCase() : "U"}
          </Text>
        </View>

        {/* Name and chat */}
        <View style={styles.mainChatItem}>
          <Text style={styles.mainChatItemTitle}>
            {chat?.name || "Untitled Group Chat"}
          </Text>
          <Text style={styles.mainChatItemSupport}>
            {`${chat?.participants?.length} Participants`}
          </Text>
        </View>

        {/* RHS CONTAINER - (Date and Unread messages notification) */}
        <View style={styles.rightSection}>
          {chat.latestMessage && (
            <Text style={styles.time}>
              {formatTime(chat.latestMessage.createdAt)}
            </Text>
          )}
          {chat.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
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
    // backgroundColor: "#D3E3FD",
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

export default ChatsGroupChat;
