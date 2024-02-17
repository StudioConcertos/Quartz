<template>
  <li class="node">
    <button @click="">
      <div :class="isGroup ? 'i-carbon-caret-right' : props.icon"></div>
      <p>{{ props.name }}</p>
    </button>
    <ul v-if="isGroup">
      <slot />
    </ul>
  </li>
</template>

<style scoped lang="postcss">
.node {
  button {
    @apply flex text-sm items-center p-2;
    @apply w-full transition-colors border-rd;
    @apply hover-bg-light-200 hover-text-dark-500;

    [class*="i-"] {
      @apply text-xl mr-2;
    }
  }

  ul {
    @apply list-none ml-6;
  }
}
</style>

<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  icon: String,
  isGroup: Boolean,
});
</script>
