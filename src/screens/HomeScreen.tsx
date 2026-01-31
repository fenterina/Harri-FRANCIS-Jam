import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Todo } from "../types/types";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import {
  addTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from "../services/todoServices";

export default function todoScreen({ route }: any) {
  const [tasks, settasks] = useState<Todo[]>([]);
  const [text, settext] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const userId = route?.params?.userId || 1;

  useEffect(() => {
    loadTodos();
  }, [userId]);

  async function loadTodos() {
    try {
      console.log("Loading todos for userId:", userId);
      const data = await getTodos(userId);
      console.log("Loaded data:", data);
      settasks(data || []);
    } catch (error) {
      console.error("Error loading todos:", error);
      Alert.alert("Error", "Failed to load todos");
    }
  }

  async function addTask() {
    if (text.trim() === "") {
      return;
    }
    try {
      console.log("Adding todo with user_id:", userId, "todo:", text);
      await addTodo({
        user_id: userId,
        todo: text,
        status: false,
      } as any);
      console.log("Todo added successfully");
      settext("");
      loadTodos();
    } catch (error) {
      console.error("Error adding task:", error);
      Alert.alert("error", "Failed to add task");
    }
  }

  function renderTask({ item }: { item: Todo }) {
    if (editingId === item.todo_id) {
      return (
        <View style={styles.taskItem}>
          <TextInput
            value={editingText}
            onChangeText={setEditingText}
            style={styles.editInput}
          />
          <Pressable style={styles.saveBtn} onPress={() => saveEdit(item)}>
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
        <Pressable onPress={() => toggleTask(item)}>
          <Text style={styles.checkbox}>{item.status ? "✓" : "☐"}</Text>
        </Pressable>
        <Text style={[styles.taskText, item.status && styles.completedText]}>
          {item.todo}
        </Text>
        <Pressable
          style={styles.editBtn}
          onPress={() => startEdit(item.todo_id!, item.todo)}
        >
          <Text style={styles.btnText}>Edit</Text>
        </Pressable>
        <Pressable style={styles.deleteBtn} onPress={() => deleteTask(item)}>
          <Text style={styles.btnText}>Delete</Text>
        </Pressable>
      </View>
    );
  }

  async function toggleTask(item: Todo) {
    try {
      const updatedItem = { ...item, status: !item.status };
      await updateTodo(updatedItem, item.todo);
      loadTodos();
    } catch (error) {
      Alert.alert("Error", "failed to toggle task");
    }
  }
  function startEdit(id: number, currentText: string) {
    setEditingId(id);
    setEditingText(currentText);
  }
  async function saveEdit(item: Todo) {
    if (editingText.trim() === "") {
      Alert.alert("Empty Task", "Please enter a task before saving");
      return;
    }
    try {
      await updateTodo(item, editingText);
      setEditingId(null);
      setEditingText("");
      loadTodos();
    } catch (error) {
      Alert.alert("Error", "Failed to update task");
    }
  }
  function cancelEdit() {
    setEditingId(null);
    setEditingText("");
  }
  async function deleteTask(item: Todo) {
    try {
      await deleteTodo(item);
      loadTodos();
    } catch (error) {
      Alert.alert("Error", "Failed to delete task");
    }
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
        keyExtractor={(item) => item.todo_id?.toString() || ""}
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
