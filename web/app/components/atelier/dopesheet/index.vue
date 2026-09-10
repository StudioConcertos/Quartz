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
const { currentComponents, animationVersion } = storeToRefs(useDeckStore());
const { duration } = usePlayhead();

const slideDuration = computed(() => {
  animationVersion.value;

  // Raw, so iterating does not subscribe to every component on the slide.
  return toRaw(currentComponents.value ?? []).reduce(
    (longest, component) =>
      component.type === "core.animation"
        ? Math.max(longest, tracksDuration(component.data.tracks))
        : longest,
    0,
  );
});

watchEffect(() => (duration.value = slideDuration.value));
</script>
