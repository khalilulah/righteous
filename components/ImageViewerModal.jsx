import React, { useState } from "react";
import {
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

const ImageViewerModal = ({ visible, imageUrl, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx) => {
      scale.value = Math.max(0.5, Math.min(ctx.startScale * event.scale, 4));
    },
    onEnd: () => {
      savedScale.value = scale.value;
      if (scale.value < 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
      }
    },
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handleDownload = async () => {
    try {
      setDownloading(true);

      // Request permissions first
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Needed",
          "Please grant permission to save images"
        );
        setDownloading(false);
        return;
      }

      // Create the directory if it doesn't exist
      const dir = `${FileSystem.cacheDirectory}/`; // Ensure there's only one 'chatFiles'
      const dirInfo = await FileSystem.getInfoAsync(dir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      }

      // Generate a unique filename
      const filename = imageUrl.split("/").pop();
      const fileUri = `${dir}${filename}`;

      // Download the file
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

      if (downloadResult.status !== 200) {
        Alert.alert("Error", "Failed to download image");
        setDownloading(false);
        return;
      }

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      await MediaLibrary.createAlbumAsync("Chat Images", asset, false);

      Alert.alert("Success", "Image saved to gallery");
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "Failed to save image");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>

        <PinchGestureHandler onGestureEvent={pinchHandler}>
          <Animated.View style={styles.imageContainer}>
            <Animated.Image
              source={{ uri: imageUrl }}
              style={[styles.fullImage, imageStyle]}
              resizeMode="contain"
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
            />
            {loading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="white" />
              </View>
            )}
          </Animated.View>
        </PinchGestureHandler>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="download-outline" size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.8,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  footerButton: {
    padding: 10,
  },
});

export default ImageViewerModal;
