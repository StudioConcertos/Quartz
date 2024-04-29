import type { Database, Json } from "~/types/database";

export const useSlides = () => {
  const client = useSupabaseClient<Database>();

  async function fetchAllSlides() {
    const { data, error } = await client
      .from("slides")
      .select("*")
      .match({ lapidary: useAuthStore().user?.id })
      .order("last_modified", { ascending: false });

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

  async function updateSlidesPages(id: String | String[], newData: any) {
    const { data, error } = await client
      .from("slides")
      .update({ pages: newData })
      .eq("id", id);

    if (error) console.log(error);

    return data;
  }

  return { fetchAllSlides, fetchSlides, updateSlidesPages };
};
