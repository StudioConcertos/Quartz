<template>
  <div class="component">
    <div class="flex items-center justify-between">
      <h4>{{ props.name.toUpperCase() }}</h4>
      <button @click="isOpen = !isOpen">
        <div
          :class="isOpen ? 'i-carbon-caret-down' : 'i-carbon-caret-right'"
        ></div>
      </button>
    </div>
    <div v-if="isOpen" class="whitespace"></div>
    <slot v-if="isOpen" />
  </div>
</template>

<style scoped lang="postcss">
.component {
  @apply w-full p-6 bg-dark-900;
  @apply border-solid border-0 border-b-2 border-dark-200;

  h4 {
    @apply text-sm font-400 opacity-60;
  }

  button {
    @apply text-2xl;
    @apply opacity-60 duration-300 hover:opacity-100;
  }

  &:deep(.field) {
    @apply flex;

    &:not(:last-child) {
      @apply mb-6;
    }

    label {
      @apply text-sm w-1/4;
    }

    input,
    textarea {
      @apply p-0 ml-2 flex-1;
    }

    textarea {
      @apply w-full;
    }
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

const isOpen = ref(true);
</script>
