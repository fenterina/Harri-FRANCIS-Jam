import React, { useState } from 'react'
import { View, TextInput, Button, Alert } from 'react-native'
import { createAccount } from '../services/authServices'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async () => {
    try {
      await createAccount(username, email, password)
      Alert.alert('Success', 'Account created!')
    } catch (err) {
      Alert.alert('Error', 'Registration failed')
    }
  }

  return (
    <View>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  )
}
