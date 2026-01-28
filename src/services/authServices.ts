import { supabase } from '../lib/supabase'

export const createAccount = async (username: string, email: string, password: string) => {
  const { error } = await supabase.from('user_information').insert({
    username,
    email,
    password,
    status: false,
  })
  if (error) throw error
}

export const loginUser = async (username: string, password: string) => {
  const { data, error } = await supabase
    .from('user_information')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single()

  if (error || !data) throw new Error('Invalid login')

  await supabase.from('user_information').update({ status: true }).eq('username', username)
  return data
}

export const logoutUser = async (username: string) => {
  await supabase.from('user_information').update({ status: false }).eq('username', username)
}

export const getActiveUser = async () => {
  const { data } = await supabase
    .from('user_information')
    .select('*')
    .eq('status', true)
    .single()

  return data
}
