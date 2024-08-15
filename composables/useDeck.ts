import type { Database } from "~/types/database";

export const useDeck = () => {
  const client = useSupabaseClient<Database>();

  async function fetchAllDecks() {
    const { data, error } = await client
      .from("decks")
      .select("*")
      .match({ lapidary: useAuthStore().user?.id })
      .order("last_modified", { ascending: false });

    if (error) console.log(error);

    return data;
  }

  async function fetchDeck(id: String | String[]) {
    const { data, error } = await client
      .from("decks")
      .select("*")
      .match({ lapidary: useAuthStore().user?.id })
      .eq("id", id)
      .single();

    if (error) console.log(error);

    return data;
  }

  async function insertNewDeck() {
    const { data, error } = await client
      .from("decks")
      .insert({
        lapidary: `${useAuthStore().user?.id}`,
        title: "New Deck",
      })
      .select()
      .single();

    if (error) console.log(error);

    navigateTo(`/atelier/${data?.id}`, {
      external: true,
      open: {
        target: "_blank",
      },
    });
  }

  return { fetchAllDecks, fetchDeck, insertNewDeck };
};
