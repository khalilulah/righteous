import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { COLORS } from "../../constants/theme";
import {
  ConfirmationModal,
  EmptyStateLayout,
  GeneralScreenLayout,
} from "../../components";
import { useFocusEffect } from "@react-navigation/native";
import { useFetchRequestsQuery } from "../../redux/actions/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { resetUnreadRequests } from "../../redux/slices/guardian/requestSlice";
import {
  useAcceptRequestMutation,
  useRejectRequestMutation,
} from "../../redux/actions/request/requestApi";
import { socket } from "../../utils/socket";

const ManageRequests = ({ navigation }) => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth?.user);
  const guardianId = loggedInUser?._id;

  // For fetching requests
  const {
    data: requests,
    error,
    isLoading,
    refetch,
  } = useFetchRequestsQuery(guardianId);

  // For accepting a request
  const [acceptRequest] = useAcceptRequestMutation();

  // For rejecting a request
  const [rejectRequest] = useRejectRequestMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const openConfirmationModal = (requestId, action) => {
    setSelectedRequest(requestId);
    setSelectedAction(action);
    setModalVisible(true);
  };

  socket.on("new_request", () => {
    refetch();
  });

  const confirmAction = async () => {
    setModalVisible(false); // Close modal
    try {
      if (selectedAction === "accept") {
        const res = await acceptRequest({
          requestId: selectedRequest,
        }).unwrap();
        const successMessage = res?.message;
        ToastAndroid.show(
          `${successMessage || "Success: Request successfully accepted"}`,
          ToastAndroid.SHORT
        );
      } else {
        const res = await rejectRequest({
          requestId: selectedRequest,
        }).unwrap();
        const successMessage = res?.message;
        ToastAndroid.show(
          `${successMessage || "Success: Request successfully rejected"}`,
          ToastAndroid.SHORT
        );
      }

      refetch(); // Refresh the request list
      dispatch(resetUnreadRequests()); // Clear badge when screen is focused
      socket.emit("get_users", guardianId);
    } catch (error) {
      console.error(`Error ${selectedAction} request`, error);
      const errorMewssage = error?.data?.message;
      ToastAndroid.show(
        `${errorMewssage || "An error occured. Please try again"}`,
        ToastAndroid.SHORT
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(resetUnreadRequests()); // Clear badge when screen is focused
    }, [dispatch])
  );

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
      <ConfirmationModal
        visible={modalVisible}
        message={`Are you sure you want to ${selectedAction} this request?`}
        onConfirm={confirmAction}
        onCancel={() => setModalVisible(false)}
      />
      {requests?.data?.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          ListHeaderComponent={() => (
            <Text style={styles.title}>Pending Requests</Text>
          )}
          data={requests?.data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 15,
                borderRadius: 10,
                backgroundColor: "rgba(242, 242, 242, 0.2)",
                marginBottom: 10,
              }}
            >
              <Text style={styles.roleText}>
                {item.teacher.firstname} {item.teacher.surname}
              </Text>
              <Text style={{ fontSize: 14, color: COLORS.darkGray }}>
                {item.message}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 0,
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() => openConfirmationModal(item._id, "accept")}
                  style={styles.acceptButton}
                >
                  <Text
                    style={{
                      color: COLORS.success,
                      fontFamily: "Suse-SemiBold",
                    }}
                  >
                    Accept
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openConfirmationModal(item._id, "reject")}
                  style={styles.rejectButton}
                >
                  <Text
                    style={{ color: COLORS.error, fontFamily: "Suse-SemiBold" }}
                  >
                    Reject
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyViewContainer}>
          <EmptyStateLayout
            title="Your Request Box is Empty"
            img="noChat"
            supportingText="Your requests will appear here as they come in"
          />
        </View>
      )}
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
  roleText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Suse-Bold",
  },
  title: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Suse-Bold",
    color: COLORS.primary,
  },
  acceptButton: {
    backgroundColor: COLORS.lightSuccess,
    color: COLORS.success,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: COLORS.lightError,
    color: COLORS.error,
    padding: 10,
    borderRadius: 5,
  },
};
export default ManageRequests;
