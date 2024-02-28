<template>
  <li class="node">
    <button
      :class="{ selected: useSlidesStore().selectedNode === $el }"
      @click="toggleNode"
    >
      <div
        ref="icon"
        :class="isGroup ? 'i-carbon-caret-right' : props.icon"
      ></div>
      <p>{{ props.name }}</p>
    </button>
    <ul ref="nested" v-if="isGroup">
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

.selected {
  @apply bg-light-200 text-dark-500;
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

const icon = ref<HTMLDivElement>();
const nested = ref<HTMLUListElement>();

function toggleNode(event: Event) {
  const node = event.target as HTMLButtonElement;

  useSlidesStore().selectedNode = node.parentNode as HTMLLIElement;

  if (props.isGroup) {
    icon.value?.classList.toggle("rotate-90");
    nested.value?.classList.toggle("hidden");
  }
}
</script>
