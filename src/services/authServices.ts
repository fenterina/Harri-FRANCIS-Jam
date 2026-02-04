import axios, { AxiosError } from 'axios';
import { supabase } from '../lib/supabase';
import Constants from 'expo-constants';
import { User } from '../types/types';

// Determine backend URL:
// 1. Use `BACKEND_API_URL` env if provided
// 2. When running in Expo on device, derive host from debuggerHost (LAN IP)
// 3. Fallback to localhost (useful for web or emulator)
// function defaultApiUrl() {
//   if (process.env.BACKEND_API_URL) return process.env.BACKEND_API_URL;
//   const debuggerHost = (Constants.manifest && (Constants.manifest as any).debuggerHost) ||
//     (Constants.manifest2 && (Constants.manifest2 as any).debuggerHost);
//   if (typeof debuggerHost === 'string') {
//     const host = debuggerHost.split(':')[0];
//     return `http://${host}:3000`;
//   }
//   return 'http://localhost:3000';
// }

// const API_URL = defaultApiUrl();

// export interface AuthCredentials {
//   username: string;
//   password: string;
// }

// export interface RegisterCredentials extends AuthCredentials {
//   email?: string;
// }

// export interface AuthResponse<T = any> {
//   user: T;
//   token?: string;
//   [key: string]: any;
// }

// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// function extractErrorMessage(error: unknown): string {
//   if (!error) return 'Unknown error';
//   if ((error as AxiosError).isAxiosError) {
//     const axiosErr = error as AxiosError<any>;
//     // Log full axios error to aid debugging (network, CORS, DNS, etc.)
//     // In Expo/devtools console you'll see details.
//     // eslint-disable-next-line no-console
//     console.error('Axios error:', {
//       message: axiosErr.message,
//       response: axiosErr.response && axiosErr.response.data,
//       request: (axiosErr as any).request,
//     });
//     return (
//       axiosErr.response?.data?.message || axiosErr.response?.data || axiosErr.message || 'Request failed'
//     ).toString();
//   }
//   return (error as Error).message || String(error);
// }

export async function login(username: User["username"], password: User["password"]) {
  try {
    console.log(username, password);
    const data = await supabase
    .from('user_information')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();
    return data;

  } catch (err) {
    throw new Error('Login failed: ' + err);
  }
}

export async function register(credentials: User) {
  try {
    console.log('Registering user:', credentials);
    
    const { data, error } = await supabase
    .from('user_information')
    .insert([
        { username: credentials.username, email: credentials.email, password: credentials.password, is_logged_in: credentials.isLoggedIn},
    ])
    .select();

    return { data, error };
  } catch (err) {
    throw new Error('Register failed: ' + err);
  }
}
