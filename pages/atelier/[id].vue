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
      <AtelierInspector />
      <AtelierPreview />
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>

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
