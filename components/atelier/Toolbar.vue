<template>
  <header class="toolbar">
    <NuxtLink to="/atelier">
      <div class="i-carbon-switcher"></div>
    </NuxtLink>
    <input
      type="text"
      maxlength="30"
      v-model="titleInput"
      @change="updateSlidesTItle($event)"
      :style="{ width: `${titleInput.length + 4}ch` }"
    />
    <NuxtLink to="/atelier">
      <div class="i-carbon-run"></div>
    </NuxtLink>
  </header>
</template>

<style scoped lang="postcss">
.toolbar {
  @apply flex justify-between items-center;
  @apply bg-dark-500 w-full h-20;
  @apply border-solid border-0 border-b-2 border-dark-200;

  a {
    @apply h-full px-6 flex items-center transition-colors;
    @apply hover-bg-light-200 hover-text-dark-500;

    [class*="i-"] {
      @apply text-2xl;
    }
  }

  input {
    @apply text-center border-none text-4;
    @apply hover-underline focus-underline;
  }
}
</style>

<script setup lang="ts">
const client = useSupabaseClient<Database>();

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const titleInput = ref(props.title);

watch(titleInput, () => {
  if (titleInput.value.length > 0) return;

  titleInput.value = props.title[0];
});

async function updateSlidesTItle(event: Event) {
  const title = event.target as HTMLInputElement;

  if (!title.value) return;

  title.value = title.value.trimStart();
  title.value = title.value.trimEnd();

  await client
    .from("slides")
    .update({ title: title.value })
    .eq("id", useRoute().params.id);
}
</script>
