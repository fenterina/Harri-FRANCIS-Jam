import { supabase } from '../lib/supabase';
import { Todo } from '../types/types';

// GET all todos for a specific user
export async function getTodos(userId: number) {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('todo_id', { ascending: false });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    console.error('Get todos failed:', err);
    return { data: null, error: err };
  }
}

// ADD new todo
export async function addTodo(todo: Omit<Todo, 'todo_id'>) {
  try {
    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          user_id: todo.user_id,
          todo: todo.todo,
          status: todo.status ?? false
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    console.error('Add todo failed:', err);
    return { data: null, error: err };
  }
}

// UPDATE todo (for editing text or toggling status)
export async function updateTodo(todoId: number, updates: Partial<Pick<Todo, 'todo' | 'status'>>) {
  try {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('todo_id', todoId)
      .select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    console.error('Update todo failed:', err);
    return { data: null, error: err };
  }
}

// DELETE todo
export async function deleteTodo(todoId: number) {
  try {
    const { data, error } = await supabase
      .from('todos')
      .delete()
      .eq('todo_id', todoId)
      .select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    console.error('Delete todo failed:', err);
    return { data: null, error: err };
  }
}