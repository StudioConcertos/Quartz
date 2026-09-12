<template>
  <div class="dopesheet-state-lane">
    <p class="dopesheet-state-label" title="Double-click a key to remove it">
      state
    </p>
    <div class="dopesheet-state-track">
      <div
        v-for="key in props.keys"
        :key="key.t"
        :style="{ left: `${(key.t / Math.max(props.duration, 1)) * 100}%` }"
        :title="key.name || 'base'"
        @pointerdown="startDrag($event, key)"
        @dblclick="emit('remove', key.t)"
        class="dopesheet-state-key"
      >
        <span class="dopesheet-state-key-name">{{ key.name || "base" }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.dopesheet-state-lane {
  @apply flex items-center gap-3 h-6;

  .dopesheet-state-label {
    @apply ui-text-5 opacity-60 truncate;

    width: var(--dopesheet-label);
  }

  .dopesheet-state-track {
    @apply relative flex-1 h-full;
  }

  .dopesheet-state-key {
    @apply absolute top-1/2 w-2 h-2;
    @apply bg-light-200 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize;

    .dopesheet-state-key-name {
      @apply absolute left-3 top-1/2 -translate-y-1/2;
      @apply ui-text-5 opacity-60 whitespace-nowrap pointer-events-none;
    }
  }
}
</style>

<script setup lang="ts">
const props = defineProps<{ keys: StateKey[]; duration: number }>();
const emit = defineEmits<{
  move: [from: number, to: number];
  remove: [t: number];
}>();

const startDrag = useKeyDrag(() => props.duration, emit);

</script>
