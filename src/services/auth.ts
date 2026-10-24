import { supabase } from "@/lib/supabase";

export type SignUpInput = {
  fullName: string;
  email: string;
  password: string;
};

export async function signUp({ fullName, email, password }: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        fullName: fullName.trim(),
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
