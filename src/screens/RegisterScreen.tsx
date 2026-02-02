import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import { User } from "../types/types";
import { useState } from "react";

export default function RegisterScreen({ navigation }) {
  const [uname, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  async function handleRegister() {
    if (pass !== confirmPass) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    let user: User = {
      username: uname,
      email: email,
      password: pass,
      isLoggedIn: false,
    };
    try {
      //TODO: Implement registration logic
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to create account. Please try again.");
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        onChangeText={(input) => setUname(input)}
        value={uname}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        onChangeText={(input) => setEmail(input)}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        onChangeText={(input) => setPass(input)}
        value={pass}
        placeholder="Password"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        onChangeText={(input) => setConfirmPass(input)}
        value={confirmPass}
        placeholder="Confirm Password"
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginLink}>Already have an account? Sign in</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d6d2c6",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#0a0404",
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0a0404",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    color: "#0a0404",
    marginTop: 15,
    fontSize: 14,
  },
});
