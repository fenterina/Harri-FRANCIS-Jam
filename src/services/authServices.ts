import { User } from "../types/types";
import { supabase } from "../lib/supabase";

export const createAccount = async (user: User) => {
  const { data, error } = await supabase
    .from("user_information")
    .insert({
      username: user.username,
      email: user.email,
      password: user.password,
    })
    .select();
  if (error) throw error;
  return data;
};

export const loginUser = async (
  username: User["username"],
  password: User["password"],
) => {
  const { data, error } = await supabase
    .from("user_information")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !data) throw new Error("Invalid login");

  await supabase
    .from("user_information")
    .update({ status: true })
    .eq("username", username);
  return data;
};

export const logoutUser = async (user: User) => {
  await supabase
    .from("user_information")
    .update({ status: false })
    .eq("username", user.username);
};

export const getActiveUser = async () => {
  const { data, error } = await supabase
    .from("user_information")
    .select("*")
    .eq("status", true);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
};
