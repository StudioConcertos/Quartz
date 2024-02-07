<template>
  <div class="dashboard">
    <p>Currently signed in as: {{ useAuthStore().user?.id }}</p>
    <p v-if="slides?.length">Slides:</p>
    <div v-for="slide in slides" :key="slide.id">
      <NuxtLink target="_blank" :to="`/atelier/${slide.id}`">{{
        slide.title
      }}</NuxtLink>
    </div>
    <button @click="insertNewSlides()">Create new Slides</button>
    <button @click="useAuth().signOut()">Sign Out</button>
  </div>
</template>

<script setup lang="ts">
import { RealtimeChannel } from "@supabase/supabase-js";

import type { Database } from "~/types/database";

const client = useSupabaseClient<Database>();

let realtimeChannel: RealtimeChannel;

const { data: slides, refresh: refreshSlides } = await useAsyncData(
  "slides",
  async () => await useSlides().fetchAllSlides()
);

async function insertNewSlides() {
  const { data, error } = await client
    .from("slides")
    .insert({
      lapidary: `${useAuthStore().user?.id}`,
    })
    .select()
    .single();

  if (error) console.log(error);

  navigateTo(`/atelier/${data?.id}`, {
    external: true,
    open: {
      target: "_blank",
    },
  });
}

onMounted(() => {
  // Temporary workaround for https://github.com/supabase/gotrue-js/issues/455
  useRouter().replace({ hash: "" });

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
