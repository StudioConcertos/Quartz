<template>
  <Title v-if="slides">{{ slides?.title }} | Quartz</Title>
  <div v-if="!slides">
    <p>Either the slides does not exist or you do not have access.</p>
    <NuxtLink to="/atelier">Return</NuxtLink>
  </div>
  <Atelier :data="slides" v-else />
</template>

<script setup lang="ts">
import { RealtimeChannel } from "@supabase/supabase-js";

import type { Database } from "~/types/database";

const client = useSupabaseClient<Database>();

let realtimeChannel: RealtimeChannel;

const { data: slides, refresh: refreshSlides } = await useAsyncData(
  async () => {
    const { data, error } = await client
      .from("slides")
      .select()
      .eq("id", useRoute().params.id)
      .single();

    if (error) console.log(error);

    return data;
  }
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
