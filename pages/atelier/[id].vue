<template>
  <p v-if="!slide">
    This slides does not exist or you do not have the access to it.
  </p>
  <p>{{ slide }}</p>
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
