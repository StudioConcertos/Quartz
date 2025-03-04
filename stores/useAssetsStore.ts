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
      assets.value = [];

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

  async function deleteSelectedAsset(deck: string, asset: FileObject) {
    const { error } = await client.storage
      .from("assets")
      .remove([`${deck}/${asset.name}`]);

    if (error) {
      return console.error(error);
    }

    await fetchAssets(deck);
  }

  return { assets, fetchAssets, deleteSelectedAsset };
});
