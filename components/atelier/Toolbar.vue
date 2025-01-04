<template>
  <header class="toolbar">
    <NuxtLink to="/atelier">
      <div class="i-carbon-switcher"></div>
    </NuxtLink>
    <input type="text" maxlength="30" v-model.lazy="title" />
    <NuxtLink :to="`/live/${useRoute().params.id}`" target="_blank">
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
    @apply w-sm text-4;
    @apply text-center border-none;
    @apply hover-underline focus-underline;
  }
}
</style>

<script setup lang="ts">
const { updateDeckTitle } = useDeckStore();

const props = defineProps<{
  title: string;
}>();

const title = computed({
  get() {
    return props.title;
  },
  async set(value) {
    if (!value.length) return;

    await updateDeckTitle(value);
  },
});
</script>
