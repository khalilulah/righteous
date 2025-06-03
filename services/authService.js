import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

const loginUser = async (email, password) => {
  try {
    const response = await fetch("http://192.168.0.102:8082/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      const { token } = data; // Assuming the token is returned in the response
      await AsyncStorage.setItem("authToken", token); // Save token to storage

      const decodedToken = jwtDecode(token); // Decode the token to get the role
      return decodedToken.role; // Use this role to set state or routing
    } else {
      throw new Error(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
};

export default loginUser;
