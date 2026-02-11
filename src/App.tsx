import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { createClient } from '@supabase/supabase-js'
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ProfileScreen from "./screens/ProfileScreen"; // New Profile Screen for avatar management
import Spinner from "react-native-loading-spinner-overlay";

import CodeLinkScreen from "./screens/CodeScreen";
import CodeScreen from "./screens/CodeScreen";

const supabase = createClient('https://ncknvmckphqlernbzfpm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ja252bWNrcGhxbGVybmJ6ZnBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTc4NjAsImV4cCI6MjA4NTYzMzg2MH0.I4JCaYMnTQ6YWFqxpY47WEN33GeLJA28MgcFcdgdhW8')
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator id="main" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* Profile Screen - User profile with avatar management */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        <Stack.Screen name="Code" component={CodeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
