import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/theme";

const HomeScreen = ({ route, navigation }) => {
  const { user, token } = route.params;

  const renderContent = () => {
    if (user.role === "parent") {
      return (
        <View>
          <Text style={styles.welcomeText}>Welcome, Parent: {user.name}</Text>
          {/* Parent-specific options */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("ParentScreen")}
          >
            <Text style={styles.buttonText}>Go to Parent Dashboard</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (user.role === "teacher") {
      return (
        <View>
          <Text style={styles.welcomeText}>Welcome, Teacher: {user.name}</Text>
          {/* Teacher-specific options */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("TeacherScreen")}
          >
            <Text style={styles.buttonText}>Go to Teacher Dashboard</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return <Text style={styles.errorText}>Invalid Role</Text>;
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.offWhite,
    padding: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default HomeScreen;

// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const HomeScreen = ({ route }) => {
//   const { user, token } = route.params;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome, {user.name}</Text>
//       <Text style={styles.subtitle}>Your Role: {user.role}</Text>
//       <Text style={styles.subtitle}>Token: {token}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#555',
//   },
// });

// export default HomeScreen;
