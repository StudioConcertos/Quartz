<template>
  <Title>{{ slide?.title }} | Quartz</Title>
  <div v-if="!slide">
    <p>Either the slides does not exist or you do not have access.</p>
    <NuxtLink to="/atelier">Return</NuxtLink>
  </div>
  <Atelier v-else />
</template>

<script setup lang="ts">
import type { Database } from "~/types/database";

const client = useSupabaseClient<Database>();

const { data: slide } = await useAsyncData(async () => {
  const { data, error } = await client
    .from("slides")
    .select()
    .eq("id", useRoute().params.id)
    .single();

  if (error) console.log(error);

  return data;
});
</script>
