<template>
  <Title>Dashboard | Quartz</Title>
  <div class="flex">
    <DashboardSidebar />
    <div class="flex-1">
      <DashboardHeader />
      <div class="whitespace"></div>
      <div class="flex flex-wrap gap-6 p-6 pt-0">
        <DashboardDeck
          v-for="deck in decks"
          :title="deck.title"
          :id="deck.id"
          :last_modified="deck.last_modified"
          :key="deck.id"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RealtimeChannel } from "@supabase/supabase-js";

const client = useSupabaseClient<Database>();

let realtimeChannel: RealtimeChannel;

const { data: decks, refresh: refreshDecks } = await useAsyncData(
  "decks",
  async () => await useDeckStore().fetchAllDecks()
);

onMounted(() => {
  // Temporary workaround for https://github.com/supabase/gotrue-js/issues/455
  useRouter().replace({ hash: "" });

  realtimeChannel = client
    .channel("public:decks")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "decks" },
      () => refreshDecks()
    );

  realtimeChannel.subscribe();
});

onUnmounted(() => {
  client.removeChannel(realtimeChannel);
});
</script>
