import { StyleSheet, Text, View, Pressable, TextInput, Alert } from "react-native";
import { useState } from "react";
import { login } from "../services/authServices";
import { User } from "../types/types";

export default function LoginScreen({ navigation }) {
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Handle user login
   * Validates credentials and navigates to HomeScreen on success
   */
  async function handleLogin() {
    // Trim whitespace from inputs before validation
    const trimmedUsername = uname.trim();
    const trimmedPassword = pass.trim();
    
    // Validate input fields
    if (trimmedUsername === "" || trimmedPassword === "") {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting login...");
      
      // Call login service with trimmed values
      const { data, error } = await login(trimmedUsername, trimmedPassword);
      
      console.log("Login response:", { data, error });
      
      // Check if login was successful
      if (data && data.user_id) {
        console.log("Login successful! User ID:", data.user_id);
        
        // Navigate to HomeScreen with userId
        navigation.navigate('Home', { userId: data.user_id });
        
        // Clear input fields
        setUname("");
        setPass("");
      } else {
        // Login failed - show error message
        const errorMessage = error || "Invalid username or password";
        console.log("Login failed:", errorMessage);
        Alert.alert("Login Failed", errorMessage);
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      
      <TextInput
        style={styles.input}
        onChangeText={(input) => setUname(input)}
        value={uname}
        placeholder="Username"
        autoCapitalize="none"
        editable={!loading}
        autoCorrect={false}  // Disable autocorrect
        autoComplete="off"   // Disable autocomplete
      />
      
      <TextInput
        style={styles.input}
        onChangeText={(input) => setPass(input)}
        value={pass}
        placeholder="Password"
        secureTextEntry={true}
        editable={!loading}
        autoCorrect={false}  // Disable autocorrect
        autoComplete="off"   // Disable autocomplete
      />
      
      <View style={styles.linkContainer}>
        <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.link}>Forgot password?</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Create account</Text>
        </Pressable>
      </View>
      
      <View>
        <Pressable 
          style={[styles.button, loading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Text>
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
  button: {
    backgroundColor: "#0a0404",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
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
  linkContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 20,
  },
  link: {
    color: "#0a0404",
    fontSize: 14,
  },
});