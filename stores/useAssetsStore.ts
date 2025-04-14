import type { FileObject } from "@supabase/storage-js";

export const useAssetsStore = defineStore("assets", () => {
  const client = useSupabaseClient<Database>();

  const assets = ref<(FileObject & { url: URL })[]>([]);

  const fonts = computed(() => {
    return assets.value.filter(
      (asset) =>
        asset.name.endsWith(".ttf") ||
        asset.name.endsWith(".otf") ||
        asset.name.endsWith(".woff") ||
        asset.name.endsWith(".woff2")
    );
  });

  const models = computed(() => {
    return assets.value.filter(
      (asset) =>
        asset.name.endsWith(".fbx") ||
        asset.name.endsWith(".glb") ||
        asset.name.endsWith(".gltf") ||
        asset.name.endsWith(".obj")
    );
  });

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

      serveAllFonts();
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

  async function serveAllFonts() {
    for (const font of fonts.value) {
      try {
        const fontName = font.name.split(".")[0];
        const fontFace = new FontFace(fontName, `url(${font.url})`);

        await fontFace.load();

        document.fonts.add(fontFace);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return { assets, fonts, models, fetchAssets, deleteSelectedAsset };
});
