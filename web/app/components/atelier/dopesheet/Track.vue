<template>
  <div class="dopesheet-track">
    <p class="dopesheet-track-label" title="Double-click a key to remove it">
      {{ props.track.path.join(".") }}
    </p>
    <div class="dopesheet-track-lane">
      <div
        v-for="key in props.track.keys"
        :key="key.t"
        :style="{ left: `${(key.t / Math.max(props.duration, 1)) * 100}%` }"
        @pointerdown="startDrag($event, key)"
        @dblclick="emit('remove', key.t)"
        class="dopesheet-key"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.dopesheet-track {
  @apply flex items-center gap-3 h-6;

  .dopesheet-track-label {
    @apply ui-text-5 opacity-60 truncate;

    width: var(--dopesheet-label);
  }

  .dopesheet-track-lane {
    @apply relative flex-1 h-full;
  }

  .dopesheet-key {
    @apply absolute top-1/2 w-2 h-2 rotate-45;
    @apply bg-accent -translate-x-1/2 -translate-y-1/2;
  }
}
</style>

<script setup lang="ts">
const props = defineProps<{ track: Track; duration: number }>();
const emit = defineEmits<{
  move: [from: number, to: number];
  remove: [t: number];
}>();

const startDrag = useKeyDrag(() => props.duration, emit);

</script>
