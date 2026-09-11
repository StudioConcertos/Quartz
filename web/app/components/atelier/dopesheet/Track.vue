<template>
  <div class="dopesheet-track">
    <p class="dopesheet-track-label">{{ props.track.path.join(".") }}</p>
    <div class="dopesheet-track-lane">
      <div
        v-for="key in props.track.keys"
        :key="key.t"
        :style="{ left: `${(key.t / Math.max(props.duration, 1)) * 100}%` }"
        @pointerdown="startDrag($event, key)"
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
const emit = defineEmits<{ move: [from: number, to: number] }>();

function startDrag(event: PointerEvent, key: TrackKey) {
  event.preventDefault();

  const lane = (event.target as HTMLElement).parentElement!;
  const box = lane.getBoundingClientRect();
  const from = key.t;

  function move(e: PointerEvent) {
    const ratio = Math.min(Math.max((e.clientX - box.left) / box.width, 0), 1);

    emit("move", from, Math.round(ratio * props.duration));
  }

  function end() {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
  }

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end);
}
</script>
