/**import { StatusBar } from "expo-status-bar";
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
import { getTodos, addTodo, updateTodo, deleteTodo } from '../services/todoServices';
import { Todo } from '../types/types';


export default function todoScreen({ route, navigation }) {
  const [tasks, settasks] = useState([]);
  const [text, settext] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [user, setUser] = useState(null);

  const { userId } = route.params;


  /*useEffect(() => {

    alert(`Welcome! User ID: ${userId}`);
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('user_information')
        .select('*')
        .eq('user_id', userId)
        .single();
    fetchUser();
    }
    }, []);

    useEffect(() => {

    const fetchUserTodos = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('todo_id', todoId)
        .single();
    };

    fetchUserTodos();
  }, []);

  useEffect(() => {
  alert(`Welcome! User ID: ${userId}`);
  
  const fetchUserData = async () => {
    // Fetch user information
    const { data: userData, error: userError } = await supabase
      .from('user_information')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user:', userError);
      return;
    }
    
    // Fetch user todos
    const { data: todoData, error: todoError } = await supabase
      .from('todos')
      .select('*')
      .eq('todos_id', todoId) 
      .single();
      // Assuming you want todos for this user
      // If you need a specific todo, use .eq('todo_id', todoId).single()
      // .eq('todo_id', todoId).single();
    
    if (todoError) {
      console.error('Error fetching todos:', todoError);
      return;
    }
    
    // Process the data
    // You might want to set state here or process the data
    console.log('User:', userData);
    console.log('Todos:', todoData);
  };
  
  fetchUserData();
}, [userId, todoId]); // Add dependencies if needed


  async function addTask() {
    if (text.trim() === "") {
      Alert.alert("Empty Task", "Please enter a task");
      return;
    }
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
**/

import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import { getTodos, addTodo, updateTodo, deleteTodo } from '../services/todoServices';
import { supabase } from '../lib/supabase';
import { Todo } from '../types/types';

export default function todoScreen({ route, navigation }) {
  const [tasks, settasks] = useState<Todo[]>([]);
  const [text, settext] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userId } = route.params;
  
  useEffect(() => {
    alert(`Welcome! User ID: ${userId}`);
    
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from('user_information')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (error) {
          console.error('Fetch user error:', error);
          return;
        }
        
        if (data) {
          setUser(data);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    
    const fetchUserTodos = async () => {
      try {
        setLoading(true);
        const { data, error } = await getTodos(userId);
        
        if (error) {
          Alert.alert('Error', 'Failed to fetch todos');
          console.error('Fetch todos error:', error);
          return;
        }

        if (data) {
          settasks(data);
        }
      } catch (err) {
        Alert.alert('Error', 'An error occurred while fetching todos');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
    fetchUserTodos();
  }, [userId]);

  async function addTask() {
    if (text.trim() === "") {
      Alert.alert("Empty Task", "Please enter a task");
      return;
    }

    try {
      setLoading(true);
      const newTodo = {
        user_id: userId,
        todo: text.trim(),
        status: false
      };

      const { data, error } = await addTodo(newTodo);

      if (error) {
        Alert.alert('Error', 'Failed to add todo');
        console.error('Add todo error:', error);
        return;
      }

      if (data && data.length > 0) {
        settasks([data[0], ...tasks]);
        settext("");
        Alert.alert('Success', 'Task added successfully!');
      }
    } catch (err) {
      Alert.alert('Error', 'An error occurred while adding task');
      console.error('Add error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleTask(todoId: number, currentStatus: boolean) {
    try {
      const { data, error } = await updateTodo(todoId, { status: !currentStatus });

      if (error) {
        Alert.alert('Error', 'Failed to update task status');
        console.error('Toggle error:', error);
        return;
      }

      settasks(
        tasks.map((task) =>
          task.todo_id === todoId ? { ...task, status: !currentStatus } : task
        )
      );
    } catch (err) {
      Alert.alert('Error', 'An error occurred while updating task');
      console.error('Toggle error:', err);
    }
  }

  function startEdit(todoId: number, currentText: string) {
    setEditingId(todoId);
    setEditingText(currentText);
  }

  async function saveEdit(todoId: number) {
    if (editingText.trim() === "") {
      Alert.alert("Empty Task", "Please enter a task before saving");
      return;
    }

    try {
      const { data, error } = await updateTodo(todoId, { todo: editingText.trim() });

      if (error) {
        Alert.alert('Error', 'Failed to update task');
        console.error('Update error:', error);
        return;
      }

      settasks(
        tasks.map((task) =>
          task.todo_id === todoId ? { ...task, todo: editingText.trim() } : task
        )
      );
      setEditingId(null);
      setEditingText("");
      Alert.alert('Success', 'Task updated successfully!');
    } catch (err) {
      Alert.alert('Error', 'An error occurred while updating task');
      console.error('Update error:', err);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingText("");
  }

  async function deleteTask(todoId: number) {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { data, error } = await deleteTodo(todoId);

              if (error) {
                Alert.alert('Error', 'Failed to delete task');
                console.error('Delete error:', error);
                return;
              }

              settasks(tasks.filter((task) => task.todo_id !== todoId));
              Alert.alert('Success', 'Task deleted successfully!');
            } catch (err) {
              Alert.alert('Error', 'An error occurred while deleting task');
              console.error('Delete error:', err);
            }
          },
        },
      ]
    );
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
          <Pressable style={styles.saveBtn} onPress={() => saveEdit(item.todo_id!)}>
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
        <Pressable onPress={() => toggleTask(item.todo_id!, item.status ?? false)}>
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
        <Pressable style={styles.deleteBtn} onPress={() => deleteTask(item.todo_id!)}>
          <Text style={styles.btnText}>Delete</Text>
        </Pressable>
      </View>
    );
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
          editable={!loading}
        />
        <Pressable 
          style={[styles.addBtn, loading && styles.disabledBtn]} 
          onPress={addTask}
          disabled={loading}
        >
          <Text style={styles.addBtnText}>{loading ? 'Adding...' : 'Add'}</Text>
        </Pressable>
      </View>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.todo_id!.toString()}
        style={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Loading tasks...' : 'No tasks yet. Add one above!'}
          </Text>
        }
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
  disabledBtn: {
    opacity: 0.6,
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
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});
