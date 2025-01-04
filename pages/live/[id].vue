<template>
  <Title>{{ deck?.title ?? "404" }} | Quartz</Title>
  <div v-if="!deck">
    <p>Either the deck does not exist or you do not have access.</p>
    <NuxtLink to="/atelier">Return</NuxtLink>
  </div>
  <div
    @keydown.enter.space.right="nextSlides()"
    @keydown.left="prevSlides()"
    tabindex="0"
    class="live"
  >
    <AtelierRender />
  </div>
</template>

<style scoped lang="postcss">
.live {
  @apply h-screen select-none;
  @apply flex justify-center items-center;
}
</style>

<script setup lang="ts">
import { RealtimeChannel } from "@supabase/supabase-js";

const client = useSupabaseClient<Database>();

const { fetchDeck, fetchAllSlides, nextSlides, prevSlides } = useDeckStore();

let deckRC: RealtimeChannel, slidesRC: RealtimeChannel;

const { data: deck, refresh: refreshDeck } = await useAsyncData(
  async () => await fetchDeck(useRoute().params.id as string)
);

const { refresh: refreshSlides } = await useAsyncData(
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
