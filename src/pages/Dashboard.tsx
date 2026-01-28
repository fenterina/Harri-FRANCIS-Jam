import React, { useEffect, useState } from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import { getActiveUser } from '../services/authServices'
import { addTodo, getTodos } from '../services/todoServices'

export default function Dashboard() {
  const [username, setUsername] = useState('')
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState<any[]>([])

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const user = await getActiveUser()
    if (user) {
      setUsername(user.username)
      loadTodos(user.username)
    }
  }

  const loadTodos = async (user: string) => {
    const data = await getTodos(user)
    setTodos(data || [])
  }

  const handleAddTodo = async () => {
    await addTodo(username, todo)
    setTodo('')
    loadTodos(username)
  }

  return (
    <View>
      <Text>Welcome, {username}</Text>

      <TextInput
        placeholder="New Todo"
        value={todo}
        onChangeText={setTodo}
      />
      <Button title="Add" onPress={handleAddTodo} />

      {todos.map((item, index) => (
        <Text key={index}>{item.todo}</Text>
      ))}
    </View>
  )
}
