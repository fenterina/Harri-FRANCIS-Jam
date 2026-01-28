import { StatusBar } from "expo-status-bar";
import { use, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";

export default function todoScreen() {
  const [tasks, settasks] = useState([]);
  const [text, settext] = useState("");
  const [editingId] = useState("");

  function addTask() {
    if (text.trim() === "") {
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      text: text,
      completed: false,
    };
    settasks([...tasks, newTask]);
    settext("");
  }

  function renderTask({ item }) {
    return (
      <View style={styles.taskItem}>
        <Pressable onPress={() => toggleTask(item.id)}>
          <Text>{item.completed ? "✓" : "☐"}</Text>
        </Pressable>
        <Text style={item.completed ? styles.completedText : null}>
          {item.text}
        </Text>
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

  return (
    <View style={styles.container}>
      <Text>My To-Do List</Text>

      <TextInput
        placeholder="add a task..."
        value={text}
        onChangeText={settext}
      />

      <Pressable onPress={addTask}>
        <Text>Add Task</Text>
      </Pressable>

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
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
  },
  taskItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
});
