<template>
  <Title v-if="slides"
    >{{ slides?.title ?? "Slides not found" }} | Quartz</Title
  >
  <div v-if="!slides">
    <p>Either the slides does not exist or you do not have access.</p>
    <NuxtLink to="/atelier">Return</NuxtLink>
  </div>
  <div v-else class="flex flex-col h-screen">
    <AtelierToolbar :title="slides.title" />
    <div class="flex flex-1">
      <aside class="inspector">
        <AtelierHierarchy />
        <div class="whitespace"></div>
        <AtelierProperties />
      </aside>
      <AtelierPreview />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.inspector {
  @apply bg-dark-500 w-2xl p-[2.5ch];
  @apply border-solid border-0 border-r-2 border-dark-200;
  @apply flex flex-col;

  .hierarchy,
  .properties {
    @apply flex-1 h-full;
  }
}
</style>

<script setup lang="ts">
import { RealtimeChannel } from "@supabase/supabase-js";

import type { Database } from "~/types/database";

const client = useSupabaseClient<Database>();

let realtimeChannel: RealtimeChannel;

const { data: slides, refresh: refreshSlides } = await useAsyncData(
  async () => await useSlides().fetchSlides(useRoute().params.id)
);

onMounted(() => {
  realtimeChannel = client
    .channel("public:slides")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "slides" },
      () => refreshSlides()
    );

  realtimeChannel.subscribe();
});

onUnmounted(() => {
  client.removeChannel(realtimeChannel);
});
</script>
