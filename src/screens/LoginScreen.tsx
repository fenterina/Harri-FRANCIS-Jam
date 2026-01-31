import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import { useState } from "react";
import { loginUser } from "../services/authServices";

export default function LoginScreen({ navigation }) {
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");
  async function handleLogin() {
    try {
      const user = await loginUser(uname, pass);
      console.log("Logged in user:", JSON.stringify(user, null, 2));
      if (user) {
        // Try different possible column names for user ID
        const userId = user.user_id || user.id || user.username;
        console.log("Using userId:", userId);
        navigation.navigate("Home", { userId: userId });
      }
    } catch (error) {
      alert("Account Not Found!");
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
      />
      <TextInput
        style={styles.input}
        onChangeText={(input) => setPass(input)}
        value={pass}
        placeholder="Password"
        secureTextEntry={true}
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
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign in</Text>
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
  },
  button: {
    backgroundColor: "#0a0404",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
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
