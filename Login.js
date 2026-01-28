import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import { use, useState } from "react";
export default function App() {
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");

  return (
    <View style={styles.container}>
      <Text>Log In</Text>
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
      />
      <View style={styles.linkContainer}>
        <Pressable onPress={() => alert("Forgot password page")}>
          <Text style={styles.link}>Forgot password?</Text>
        </Pressable>
        <Pressable onPress={() => alert("Create account page")}>
          <Text style={styles.link}>Create account</Text>
        </Pressable>
      </View>
      <View>
        <Pressable style={styles.button}>
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
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#0a0404",
    padding: 10,
    marginBottom: 10,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  button: {
    backgroundColor: "#0a0404",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
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
