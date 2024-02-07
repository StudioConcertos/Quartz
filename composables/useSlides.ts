import type { Database } from "~/types/database";

export const useSlides = () => {
  const client = useSupabaseClient<Database>();

  async function fetchAllSlides() {
    const { data, error } = await client
      .from("slides")
      .select("*")
      .match({ lapidary: useAuthStore().user?.id });

    if (error) console.log(error);

    return data;
  }

  async function fetchSlides(id: String | String[]) {
    const { data, error } = await client
      .from("slides")
      .select("*")
      .match({ lapidary: useAuthStore().user?.id })
      .eq("id", id)
      .single();

    if (error) console.log(error);

    return data;
  }

  return { fetchAllSlides, fetchSlides };
};
