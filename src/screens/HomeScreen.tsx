import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { logout, getCurrentUser } from "../services/authServices";
import { getTodos } from "../services/todoServices";
import TodoInput from "../components/TodoInput";
import TodoList from "../components/TodoList";
import { Todo } from "../types/types";

export default function HomeScreen({ navigation }: any) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
    loadTodos();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const loadTodos = async () => {
    try {
      const fetchedTodos = await getTodos();
      setTodos(fetchedTodos);
    } catch (error) {
      console.error("Error loading todos:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace("Login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleTodoAdded = () => {
    loadTodos();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Todos</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {user && (
        <Text style={styles.userEmail}>Welcome, {user.email}</Text>
      )}

      <TodoInput onTodoAdded={handleTodoAdded} />
      <TodoList todos={todos} onTodosChange={loadTodos} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: "#007AFF",
    fontSize: 16,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
});
