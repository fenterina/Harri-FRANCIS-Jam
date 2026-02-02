import { StatusBar } from "expo-status-bar";
import { use, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  Alert,
} from "react-native";

export default function todoScreen({ route, navigation }) {
  const [tasks, settasks] = useState([]);
  const [text, settext] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [user, setUser] = useState(null);

  const { userId } = route.params;

  useEffect(() => {
    //TODO: Fetch user data based on userId
    const fetchUser = async () => {};

    fetchUser();
  }, []);

  function addTask() {
    //TODO: Add new task to the list
  }

  function renderTask({ item }) {
    if (editingId === item.id) {
      return (
        <View style={styles.taskItem}>
          <TextInput
            value={editingText}
            onChangeText={setEditingText}
            style={styles.editInput}
          />
          <Pressable style={styles.saveBtn} onPress={() => saveEdit(item.id)}>
            <Text style={styles.btnText}>Save</Text>
          </Pressable>
          <Pressable style={styles.cancelBtn} onPress={cancelEdit}>
            <Text style={styles.btnText}>Cancel</Text>
          </Pressable>
        </View>
      );
    }
    return (
      <View style={styles.taskItem}>
        <Pressable onPress={() => toggleTask(item.id)}>
          <Text style={styles.checkbox}>{item.completed ? "✓" : "☐"}</Text>
        </Pressable>
        <Text style={[styles.taskText, item.completed && styles.completedText]}>
          {item.text}
        </Text>
        <Pressable
          style={styles.editBtn}
          onPress={() => startEdit(item.id, item.text)}
        >
          <Text style={styles.btnText}>Edit</Text>
        </Pressable>
        <Pressable style={styles.deleteBtn} onPress={() => deleteTask(item.id)}>
          <Text style={styles.btnText}>Delete</Text>
        </Pressable>
      </View>
    );
  }

  function toggleTask(id) {
    settasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }
  function startEdit(id, currentText) {
    setEditingId(id);
    setEditingText(currentText);
  }
  function saveEdit(id) {
    if (editingText.trim() === "") {
      Alert.alert("Empty Task", "Please enter a task before saving");
      return;
    }
    settasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: editingText } : task,
      ),
    );
    setEditingId(null);
    setEditingText("");
  }
  function cancelEdit() {
    setEditingId(null);
    setEditingText("");
  }
  function deleteTask(id) {
    settasks(tasks.filter((task) => task.id !== id));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My To-Do List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          value={text}
          onChangeText={settext}
        />
        <Pressable style={styles.addBtn} onPress={addTask}>
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.listContainer}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d6d2c6",
    paddingTop: 100,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#0a0404",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  addBtn: {
    backgroundColor: "#0a0404",
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  checkbox: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    flexWrap: "wrap",
    marginRight: 10,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  editBtn: {
    backgroundColor: "#0a0404",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteBtn: {
    backgroundColor: "#f44336",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#0a0404",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: "#0a0404",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  cancelBtn: {
    backgroundColor: "#9E9E9E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
});
