import React, { useState } from 'react'
import { View, TextInput, Button, Alert } from 'react-native'
import { loginUser } from '../services/authServices'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const user = await loginUser(username, password)
      console.log('Logged in:', user)
      Alert.alert('Success', 'Logged in!')
    } catch (err) {
      Alert.alert('Error', 'Login failed')
    }
  }

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  )
}

