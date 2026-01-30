import { Database } from "../database.types";

// User types based on "User Information" table
export type UserRow = Database["public"]["Tables"]["User Information"]["Row"];
export type UserInsert =
  Database["public"]["Tables"]["User Information"]["Insert"];
export type UserUpdate =
  Database["public"]["Tables"]["User Information"]["Update"];

// Todo types based on "To-do list" table
export type TodoRow = Database["public"]["Tables"]["To-do list"]["Row"];
export type TodoInsert = Database["public"]["Tables"]["To-do list"]["Insert"];
export type TodoUpdate = Database["public"]["Tables"]["To-do list"]["Update"];

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
