<template>
  <Title>{{ deck?.title ?? "404" }} | Quartz</Title>
  <div v-if="!deck">
    <p>Either the deck does not exist or you do not have access.</p>
    <NuxtLink to="/atelier">Return</NuxtLink>
  </div>
  <div
    v-else
    @click="prevSlides()"
    @contextmenu.prevent="nextSlides()"
    @keydown.enter.space.right="nextSlides()"
    @keydown.left="prevSlides()"
    @mousemove="onCursorMoved"
    tabindex="0"
    autofocus
    class="live"
  >
    <AtelierRender />
    <div
      :class="{
        'opacity-0': !cursorMoved,
      }"
      class="overlay"
    >
      <p>Page {{ currentSlidesIndex + 1 }} / {{ slides.length }}</p>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.live {
  @apply h-screen select-none;
  @apply flex justify-center items-center;

  .overlay {
    @apply fixed bottom-18 bg-dark-900 p-3 rounded-6 text-3;
    @apply transition-opacity duration-300;
  }
}
</style>

<script setup lang="ts">
import { RealtimeChannel } from "@supabase/supabase-js";

const client = useSupabaseClient<Database>();

const { fetchDeck, fetchAllSlides, nextSlides, prevSlides } = useDeckStore();
const { slides, currentSlidesIndex } = storeToRefs(useDeckStore());

const { isFullscreen } = useFullscreen();

watch(isFullscreen, (isFullscreen) => {
  if (!isFullscreen) {
    leavePresentation();
  }
});

const cursorMoved = ref(false);

function onCursorMoved() {
  if (cursorMoved.value) return;

  cursorMoved.value = true;

  setTimeout(() => {
    cursorMoved.value = false;
  }, 5000);
}

function leavePresentation() {
  navigateTo(`/atelier/${deck.value?.id}`);
}

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
  document.documentElement.requestFullscreen();

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
