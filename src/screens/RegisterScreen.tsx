import { StyleSheet, Text, View, Pressable, TextInput, Alert } from "react-native";
import { useState } from "react";
import { register } from "../services/authServices";
import { User } from "../types/types";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Handle user registration
   * Validates input and creates new account
   */
  async function handleRegister() {
    // Validate all fields are filled
    if (username.trim() === "" || email.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting registration...");

      // Create user credentials object
      const credentials: User = {
        username: username.trim(),
        email: email.trim(),
        password: password,
        isLoggedIn: false
      };

      // Call register service
      const { data, error } = await register(credentials);

      console.log("Register response:", { data });

      // Check if registration was successful
      if (data && data.length > 0) {
        console.log("Registration successful!");
        
        // Show success message
        Alert.alert(
          "Success",
          "Account created successfully! You can now log in.",
          [
            {
              text: "OK",
              onPress: () => {
                // Navigate back to Login screen
                navigation.navigate("Login");
              }
            }
          ]
        );
        
        // Clear input fields
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        // Registration failed - show error message
        const errorMessage = error || "Failed to create account";
        console.log("Registration failed:", errorMessage);
        Alert.alert("Registration Failed", errorMessage);
      }
    } catch (err) {
      console.error("Registration error:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder="Username"
        autoCapitalize="none"
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        placeholder="Confirm Password"
        secureTextEntry={true}
        editable={!loading}
      />
      
      <View style={styles.buttonContainer}>
        <Pressable 
          style={[styles.button, loading && styles.disabledButton]} 
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating Account...' : 'Register'}
          </Text>
        </Pressable>
        
        <Pressable 
          style={styles.backButton} 
          onPress={() => navigation.navigate("Login")}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>Back to Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d6d2c6",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#0a0404",
    padding: 10,
    marginBottom: 10,
    textAlign: "left",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    width: "80%",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#0a0404",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "transparent",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0a0404",
  },
  backButtonText: {
    color: "#0a0404",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});