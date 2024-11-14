<template>
  <div class="component">
    <h4>{{ props.name.toUpperCase() }}:</h4>
    <div class="whitespace"></div>
    <slot />
    <div class="whitespace"></div>
  </div>
</template>

<style scoped lang="postcss">
.component {
  @apply w-full p-6 bg-dark-900;
  @apply border-solid border-0 border-b-2 border-dark-200;

  .row {
    @apply flex;

    .column {
      @apply flex;
    }
  }
}

.component:deep(h4) {
  @apply text-sm font-300 opacity-60;
}

.component:deep(.row) {
  .column {
    @apply flex items-start w-full;

    input,
    textarea {
      @apply p-0 ml-2 w-12;
    }

    textarea {
      @apply w-full;
    }
  }

  > .column:not(:first-child) {
    @apply ml-6;
  }
}
</style>

<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});
</script>
