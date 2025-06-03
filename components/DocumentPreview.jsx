import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DocumentPreview = ({ item, fileUrl, fileType, fileName, fileSize }) => {
  // Function to get file extension from URL or type
  const getFileExtension = () => {
    if (fileUrl) {
      const match = fileUrl.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
      return match ? match[1].toUpperCase() : "DOC";
    }
    return fileType.split("/")[1].toUpperCase();
  };

  // Function to get icon name based on file type
  const getFileIcon = () => {
    const extension = getFileExtension().toLowerCase();
    switch (extension) {
      case "pdf":
        return "document-text";
      case "doc":
      case "docx":
        return "document";
      case "xls":
      case "xlsx":
        return "grid";
      case "ppt":
      case "pptx":
        return "albums";
      default:
        return "document-attach";
    }
  };

  // Function to get color based on file type
  const getFileColor = () => {
    const extension = getFileExtension().toLowerCase();
    switch (extension) {
      case "pdf":
        return "#FF4433";
      case "doc":
      case "docx":
        return "#2B579A";
      case "xls":
      case "xlsx":
        return "#217346";
      case "ppt":
      case "pptx":
        return "#B7472A";
      default:
        return "#6B7280";
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => Linking.openURL(fileUrl)}
    >
      <View style={[styles.iconContainer, { backgroundColor: getFileColor() }]}>
        <Ionicons name={getFileIcon()} size={24} color="white" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.fileName} numberOfLines={1}>
          {item?.fileName || `Document.${getFileExtension()}`}
        </Text>
        {fileSize && (
          <Text style={styles.fileSize}>{(fileSize / 1024).toFixed(1)} KB</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "72%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  fileSize: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});

export default DocumentPreview;
