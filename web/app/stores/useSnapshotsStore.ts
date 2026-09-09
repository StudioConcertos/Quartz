const LIST_LIMIT = 1000;

export const useSnapshotsStore = defineStore("snapshots", () => {
  const client = useSupabaseClient();

  const cached = useLocalStorage<{
    deck: string;
    at: number;
    urls: Record<string, string>;
  }>("quartz-snapshot-urls", { deck: "", at: 0, urls: {} });

  function snapshotUrl(slides: string) {
    return cached.value.urls[slides];
  }

  async function fetchSnapshots(deck: string) {
    if (!deck) return;
    if (deck === cached.value.deck && !signaturesStale(cached.value.at)) return;

    const { data, error } = await client.storage
      .from("snapshots")
      .list(deck, { limit: LIST_LIMIT });

    if (error) console.error(error);
    if (!data) return;

    const names = data.flatMap((object) =>
      object.name.endsWith(".png") ? [object.name] : [],
    );

    const signed = await signStorageObjects("snapshots", deck, names);

    if (!signed) return;

    cached.value = {
      deck,
      at: Date.now(),
      urls: Object.fromEntries(
        [...signed].map(([name, url]) => [name.replace(/\.png$/, ""), url]),
      ),
    };
  }

  async function refreshSnapshot(deck: string, slides: string) {
    if (deck !== cached.value.deck) return;

    const held =
      snapshotUrl(slides) ??
      (await signStorageObject("snapshots", deck, `${slides}.png`));

    if (!held) return;

    const url = new URL(held);

    url.searchParams.set("t", String(Date.now()));

    cached.value.urls[slides] = url.toString();
  }

  return { snapshotUrl, fetchSnapshots, refreshSnapshot };
});
