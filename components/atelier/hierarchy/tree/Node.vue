<template>
  <li class="node">
    <button
      :class="{ selected: useSlidesStore().selectedNode === $el }"
      class="primaryBtn"
      @click="toggleNode"
      @dblclick="toggleGroup"
    >
      <div
        ref="icon"
        :class="isGroup ? 'i-carbon-caret-down' : props.icon"
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
    @apply px-2 mb-2 justify-initial;
    @apply w-full border-none;

    p,
    [class*="i-"] {
      @apply pointer-events-none;
    }

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
import { useSortable } from "@vueuse/integrations/useSortable";

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

useSortable(nested, [], {
  animation: "200",
  easing: "cubic-bezier(1, 0, 0, 1)",
  forceFallback: true,
});

function toggleNode(event: Event) {
  const node = event.target as HTMLButtonElement;

  useSlidesStore().selectedNode = node.parentElement as HTMLLIElement;
}

function toggleGroup() {
  if (!props.isGroup) return;

  icon.value?.classList.toggle("-rotate-90");
  nested.value?.classList.toggle("hidden");
}
</script>
