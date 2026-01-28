import { supabase } from '../lib/supabase'

export const addTodo = async (username: string, todo: string) => {
  await supabase.from('todo_list').insert({ username, todo })
}

export const getTodos = async (username: string) => {
  const { data } = await supabase.from('todo_list').select('*').eq('username', username)
  return data
}

export const updateTodo = async (id: string, newTodo: string) => {
  await supabase.from('todo_list').update({ todo: newTodo }).eq('id', id)
}

export const deleteTodo = async (id: string) => {
  await supabase.from('todo_list').delete().eq('id', id)
}
