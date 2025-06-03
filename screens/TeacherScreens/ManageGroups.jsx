import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import {
  Button,
  EmptyStateLayout,
  GeneralScreenLayout,
  Input,
} from "../../components";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  useFetchGroupsQuery,
  useCreateGroupMutation,
  useFetchUsersQuery,
} from "../../redux/actions/chat/chatsApi";
import { GroupChat } from "../GeneralScreens";
import { socket } from "../../utils/socket";

const ManageGroups = ({ navigation }) => {
  const loggedInUser = useSelector((state) => state.auth?.user);
  const userId = loggedInUser?._id;

  // Fetch groups
  const { data: groups, error, isLoading, refetch } = useFetchGroupsQuery();

  // Fetch users
  const { data: users, isLoading: isLoadingUsers } = useFetchUsersQuery();

  // Create group mutation
  const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle create group
  const handleCreateGroup = async () => {
    if (!groupName.trim())
      return ToastAndroid.show("Group name is required", ToastAndroid.SHORT);
    if (selectedUsers.length === 0)
      return ToastAndroid.show("Select at least one user", ToastAndroid.SHORT);
    try {
      await createGroup({
        groupName,
        participantIds: selectedUsers,
      }).unwrap();
      setModalVisible(false);
      setGroupName("");
      setSelectedUsers([]);
      refetch();
      socket.emit("get_users", userId);
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to create group";
      ToastAndroid.show(`${errorMessage}`, ToastAndroid.SHORT);
    }
  };

  if (error) {
    return (
      <View style={styles.emptyViewContainer}>
        <Text style={{ color: "red" }}>
          Error: {error?.data?.message || "Failed to load requests"}
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <GeneralScreenLayout>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </GeneralScreenLayout>
    );
  }

  return (
    <GeneralScreenLayout navigation={navigation}>
      {/* Group List */}
      {groups?.data?.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          ListHeaderComponent={() => (
            <Text style={styles.title}>Available Groups Chats</Text>
          )}
          data={groups?.data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <GroupChat
              chat={item}
              navigation={navigation}
              currentUserId={userId}
            />
          )}
        />
      ) : (
        <View style={styles.emptyViewContainer}>
          <EmptyStateLayout
            title="You're Not in Any Group Yet"
            img="noChat"
            supportingText="Join or create a group to start chatting with others"
          />
        </View>
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="people-outline" size={24} color="white" />
      </TouchableOpacity>

      {/* Create Group Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create New Group</Text>

              {/* Group Name Input */}
              <Input label={"Group Name"} onChangeText={setGroupName} />

              {/* Users List */}
              <Text style={styles.userListTitle}>Select Users:</Text>
              {isLoadingUsers ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <FlatList
                  data={users?.data}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.userItem,
                        selectedUsers.includes(item._id) && styles.selectedUser,
                      ]}
                      onPress={() => toggleUserSelection(item._id)}
                    >
                      <Text style={styles.userText}>
                        {" "}
                        {item?.firstname} {item?.surname}
                      </Text>
                      {selectedUsers.includes(item._id) && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={COLORS.primary}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                />
              )}

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <Button onPress={handleCreateGroup} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create"}
                </Button>
                <Button
                  variant="outlined"
                  onPress={() => setModalVisible(false)}
                >
                  Cancel
                </Button>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </GeneralScreenLayout>
  );
};

const styles = {
  emptyViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
    flexGrow: 1,
  },
  title: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Suse-Bold",
    color: COLORS.primary,
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
  userListTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  selectedUser: {
    backgroundColor: COLORS.lightPrimary,
  },
  userText: {
    fontSize: 14,
    fontFamily: "Suse-Regular",
  },
  buttonContainer: {
    gap: 10,
    marginTop: 20,
  },
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
};

export default ManageGroups;
