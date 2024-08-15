import type { Database } from "~/types/database";

export const useSlides = () => {
  const client = useSupabaseClient<Database>();

  async function fetchAllSlides(deck: String | String[]) {
    const { data, error } = await client
      .from("slides")
      .select("*")
      .match({ deck: deck })
      .order("index", { ascending: false });

    if (error) console.log(error);

    return data;
  }

  return { fetchAllSlides };
};
