<template>
  <Title>{{ deck?.title ?? "404" }} | Quartz</Title>
  <div v-if="!deck">
    <p>Either the deck does not exist or you do not have access.</p>
    <NuxtLink to="/atelier">Return</NuxtLink>
  </div>
  <div @contextmenu.prevent v-else class="flex flex-col h-screen select-none">
    <AtelierHeader :title="deck.title" />
    <div class="flex flex-1 overflow-hidden">
      <AtelierToolbar />
      <div class="editor border-r">
        <AtelierHierarchy />
        <div class="whitespace"></div>
        <AtelierInspector />
      </div>
      <div class="flex flex-1 flex-col">
        <div class="px-40 h-[80vh] flex items-center">
          <AtelierRender />
        </div>
        <AtelierTimeline />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.editor {
  @apply bg-dark-700 w-[30vw] p-[2.5ch];
  @apply flex flex-col;

  /*
    The bottom padding offsets back the hidden overflow on the Y axis,
    which prevents the last element not being scrollable.
  */
  .hierarchy,
  .inspector {
    @apply flex-1 overflow-y-hidden pb-10;
  }
}
</style>

<script setup lang="ts">
import { RealtimeChannel } from "@supabase/supabase-js";

const client = useSupabaseClient<Database>();

const { fetchDeck, fetchAllSlides } = useDeckStore();

let deckRC: RealtimeChannel, slidesRC: RealtimeChannel;

const { data: deck, refresh: refreshDeck } = await useAsyncData(
  "deck",
  async () => await fetchDeck(useRoute().params.id as string)
);

const { refresh: refreshSlides } = await useAsyncData(
  "slides",
  async () => await fetchAllSlides(useRoute().params.id as string)
);

onMounted(() => {
  deckRC = client
    .channel("public:decks")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "decks" },
      () => refreshDeck()
    )
    .subscribe();

  slidesRC = client
    .channel("public:slides")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "slides",
        filter: `deck=eq.${deck.value?.id}`,
      },
      () => refreshSlides()
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "slides",
      },
      () => refreshSlides()
    )
    .subscribe();
});

onUnmounted(() => {
  client.removeAllChannels();
});
</script>
