import { supabase } from "../lib/supabase";
import { Todo } from "../types/types";

export const addTodo = async (todo: Todo) => {
  await supabase
    .from("todo_list")
    .insert({ user_id: todo.user_id, todo: todo.todo, status: todo.status });
};

export const getTodos = async (todo: Todo) => {
  const { data } = await supabase
    .from("todo_list")
    .select("*")
    .eq("user_id", todo.user_id);
  return data;
};

export const updateTodo = async (todo: Todo, newTodo: string) => {
  await supabase
    .from("todo_list")
    .update({ todo: newTodo })
    .eq("user_id", todo.user_id);
};

export const deleteTodo = async (todo: Todo) => {
  await supabase.from("todo_list").delete().eq("todo_id", todo.todo_id);
};
