<template>
  <div class="dopesheet">
    <AtelierDopesheetTransport />
  </div>
</template>

<style scoped lang="postcss">
.dopesheet {
  @apply bg-dark-800 w-full;
  @apply border-solid border-0 border-t-2 border-dark-200;
}
</style>

<script setup lang="ts">
const { currentComponents } = storeToRefs(useDeckStore());
const { duration } = usePlayhead();

const slideDuration = computed(() =>
  (currentComponents.value ?? [])
    .filter((component) => component.type === "core.animation")
    .reduce(
      (longest, component) =>
        Math.max(longest, tracksDuration(component.data?.tracks)),
      0,
    ),
);

watchEffect(() => (duration.value = slideDuration.value));
</script>
