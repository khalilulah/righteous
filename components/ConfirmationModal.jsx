import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

const ConfirmationModal = ({ visible, message, onConfirm, onCancel }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Suse-SemiBold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.lightGray,
    marginRight: 10,
    alignItems: "center",
  },
  confirmButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  cancelText: {
    color: COLORS.darkGray,
    fontFamily: "Suse-SemiBold",
    fontWeight: "600",
  },
  confirmText: {
    color: "white",
    fontFamily: "Suse-SemiBold",
    fontWeight: "600",
  },
});

export default ConfirmationModal;
