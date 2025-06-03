import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "../../constants/theme";

const GroupChat = ({ navigation, chat, currentUserId }) => {
  return (
    <>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("GroupDetails", {
            chat,
            currentUserId,
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

export default GroupChat;
