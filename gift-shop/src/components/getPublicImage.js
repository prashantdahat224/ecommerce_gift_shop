import { supabase } from "../supabaseClient";

export const getPublicImage = (path) => {
  if (!path) return "";

  const { data } = supabase.storage
    .from("products") //  use SAME bucket as old code
    .getPublicUrl(path);

  return data?.publicUrl || "";
};
