import { Database } from "../database.types";

export interface User {
  user_id?: number;
  username: string;
  email: string;
  password: string | null;
  isLoggedIn: boolean | null;
}

export interface Todo {
  todo_id?: number;
  user_id: number;
  todo: string;
  status: boolean | null;
}

