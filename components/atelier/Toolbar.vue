<template>
  <div class="toolbar">
    <NuxtLink to="/atelier">
      <div class="i-carbon-workspace"></div>
    </NuxtLink>
    <input
      type="text"
      maxlength="30"
      @change="updateSlidesTItle($event)"
      :value="$props.title"
    />
    <NuxtLink to="/atelier">
      <div class="i-carbon-play"></div>
    </NuxtLink>
  </div>
</template>

<style scoped lang="postcss">
.toolbar {
  @apply flex justify-between items-center;
  @apply bg-dark-500 w-full h-20;
  @apply border-solid border-0 border-b-2 border-dark-200;

  a {
    @apply h-full px-6 flex items-center transition-colors;
    @apply hover:bg-light-200 hover:text-dark-500;

    [class*="i-"] {
      @apply text-2xl;
    }
  }

  input {
    @apply bg-dark-500 border-none text-center;
    @apply text-light-200 text-4;
  }
}
</style>

<script setup lang="ts">
import type { Database } from "~/types/database";

const client = useSupabaseClient<Database>();

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

async function updateSlidesTItle(event: Event) {
  const title = event.target as HTMLInputElement;

  if (!title.value) {
    title.value = props.title.toString();

    return;
  }

  await client
    .from("slides")
    .update({ title: title.value })
    .eq("id", useRoute().params.id);
}
</script>
