<template>
  <div class="flex">
    <AtelierDashboardSidebar />
    <div class="flex-1 p-6">
      <button @click="insertNewSlides()" class="primaryBtn">
        <div class="i-carbon-add mr-2"></div>
        New Slides
      </button>
      <div class="whitespace"></div>
      <div class="flex flex-wrap gap-6">
        <AtelierDashboardSlides
          v-for="slide in slides"
          :title="slide.title"
          :id="slide.id"
          :last_modified="slide.last_modified"
          :key="slide.id"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RealtimeChannel } from "@supabase/supabase-js";

const client = useSupabaseClient<Database>();

let realtimeChannel: RealtimeChannel;

const { data: slides, refresh: refreshSlides } = await useAsyncData(
  "slides",
  async () => await useSlides().fetchAllSlides(),
);

async function insertNewSlides() {
  const { data, error } = await client
    .from("slides")
    .insert({
      lapidary: `${useAuthStore().user?.id}`,
      pages: [
        {
          name: "Page",
          type: "group",
          reference: "root",
          children: [],
        },
      ],
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
      () => refreshSlides(),
    );

  realtimeChannel.subscribe();
});

onUnmounted(() => {
  client.removeChannel(realtimeChannel);
});
</script>
