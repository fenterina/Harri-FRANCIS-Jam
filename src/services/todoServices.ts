import { supabase } from "../lib/supabase";
import { Todo } from "../types/types";

export const addTodo = async (todo: Todo) => {
  const { data, error } = await supabase
    .from("todos")
    .insert({ user_id: todo.user_id, todo: todo.todo, status: todo.status });

  if (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
  return data;
};

export const getTodos = async (user_id: Todo["user_id"]) => {
  const { data } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user_id);
  return data;
};

export const updateTodo = async (todo: Todo, newTodo: string) => {
  const { error } = await supabase
    .from("todos")
    .update({ todo: newTodo, status: todo.status })
    .eq("todo_id", todo.todo_id)
    .eq("user_id", todo.user_id);
  
  if (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
};

export const deleteTodo = async (todo: Todo) => {
  await supabase
    .from("todos")
    .delete()
    .eq("todo_id", todo.todo_id)
    .eq("user_id", todo.user_id);
};
