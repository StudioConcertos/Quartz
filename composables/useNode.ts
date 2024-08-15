import type { Database } from "~/types/database";

export const useNode = () => {
  const client = useSupabaseClient<Database>();

  async function fetchAllNodes() {}

  async function insertNewNode(slides: string, name: string, type: NodeType) {
    const { data, error } = await client
      .from("nodes")
      .insert({
        slides: slides.toString(),
        name: name,
        type: type,
        path: "",
      })
      .select();

    if (error) console.log(error);

    return data;
  }

  return { fetchAllNodes, insertNewNode };
};
