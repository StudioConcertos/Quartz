<template>
  <div class="dopesheet-transport">
    <div class="dopesheet-transport-controls">
      <UIButton
        variant="icon"
        :disabled="!playable"
        :aria-label="playing ? 'Pause' : 'Play'"
        @click="toggle"
      >
        <div :class="playing ? 'i-carbon-pause' : 'i-carbon-play'"></div>
      </UIButton>
      <UIButton
        variant="icon"
        :disabled="!canPlay"
        aria-label="Stop"
        @click="reset"
      >
        <div class="i-carbon-stop"></div>
      </UIButton>
      <p class="dopesheet-readout">{{ (time / 1000).toFixed(2) }}s</p>
    </div>
    <input
      type="range"
      min="0"
      :max="duration"
      :value="time"
      :disabled="!canPlay"
      @input="seek(Number(($event.target as HTMLInputElement).value))"
    />
  </div>
</template>

<style scoped lang="postcss">
.dopesheet-transport {
  @apply flex items-center gap-3 px-[2.5ch] py-2;

  .dopesheet-transport-controls {
    @apply flex items-center gap-2 shrink-0;

    width: var(--dopesheet-label);
  }

  input[type="range"] {
    @apply flex-1 h-4 appearance-none bg-transparent cursor-pointer border-none;

    &:disabled {
      @apply opacity-50 cursor-not-allowed;
    }

    &:focus-visible {
      @apply outline outline-1 outline-offset-2 outline-accent;
    }

    &::-webkit-slider-runnable-track {
      @apply h-0.5 border-rd bg-dark-200;
    }

    &::-moz-range-track {
      @apply h-0.5 border-rd bg-dark-200;
    }

    &::-webkit-slider-thumb {
      @apply appearance-none w-2.5 h-2.5 -mt-1;
      @apply border-rd border-none bg-accent;
    }

    &::-moz-range-thumb {
      @apply w-2.5 h-2.5 border-rd border-none bg-accent;
    }
  }

  .dopesheet-readout {
    @apply ui-text-3 tabular-nums opacity-60 m-0;
  }
}
</style>

<script setup lang="ts">
const { time, playing, duration, canPlay, playable, toggle, seek, reset } =
  usePlayhead();
</script>
