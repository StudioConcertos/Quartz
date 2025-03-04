import type { FileObject } from "@supabase/storage-js";

export const useAssetsStore = defineStore("assets", () => {
  const client = useSupabaseClient<Database>();

  const assets = ref<(FileObject & { url: URL })[]>([]);

  async function fetchAssets(deck: string) {
    const { data, error } = await client.storage.from("assets").list(deck);

    if (error) {
      console.error(error);
    }

    if (data) {
      for (const asset of data) {
        const { url, response } = await getStorageObject(
          "assets",
          deck,
          asset.name
        );

        if (response.ok) {
          assets.value.push({
            ...(asset as FileObject),
            url,
          });
        }
      }
    }
  }

  return { assets, fetchAssets };
});
