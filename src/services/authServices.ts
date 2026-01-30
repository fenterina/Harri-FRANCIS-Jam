import { User } from "../types/types";
import { supabase } from "../lib/supabase";

export const createAccount = async (user: User) => {
  const { error } = await supabase.from("user_information").insert({
    username: user.username,
    email: user.email,
    password: user.password,
    status: false,
  });
  if (error) throw error;
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
  const { data } = await supabase
    .from("user_information")
    .select("*")
    .eq("status", true)
    .single();

  return data;
};
