<template>
  <li class="node">
    <button
      :class="{ selected: useSlidesStore().selectedNode === $el }"
      class="primaryBtn"
      @click="toggleNode"
      @dblclick="toggleGroup"
    >
      <div class="flex items-center">
        <div
          ref="icon"
          :class="isGroup ? 'i-carbon-caret-down' : props.icon"
        ></div>
        <p class="text-nowrap">
          {{ props.name }}
        </p>
      </div>
      <p
        v-if="props.reference"
        :class="{
          'opacity-0': useSlidesStore().selectedNode !== $el,
        }"
        class="reference"
      >
        {{ props.reference }}
      </p>
    </button>
    <ul ref="nested" v-if="isGroup && props.children">
      <AtelierHierarchyTreeNode
        v-for="node in props.children"
        :children="node.children"
        :name="node.name"
        icon="i-carbon-text-short-paragraph"
        :isGroup="node.type === 'group'"
      />
    </ul>
  </li>
</template>

<style scoped lang="postcss">
.node {
  button {
    @apply px-2 mb-2 justify-between;
    @apply w-full border-none;

    div p,
    [class*="i-"] {
      @apply pointer-events-none;
    }

    div [class*="i-"] {
      @apply text-xl mr-2;
    }

    .reference {
      @apply italic text-dark-800 mr-2;
      @apply transition-opacity;
    }
  }

  button:hover .reference {
    @apply opacity-100;
  }

  ul {
    @apply list-none ml-6;
  }
}

.selected {
  @apply bg-light-200 text-dark-800;
}
</style>

<script setup lang="ts">
import { useSortable } from "@vueuse/integrations/useSortable";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  reference: String,
  icon: String,
  isGroup: Boolean,
  children: [Object],
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

  console.log(useSlidesStore().selectedNode);
}

function toggleGroup() {
  if (!props.isGroup) return;

  icon.value?.classList.toggle("-rotate-90");
  nested.value?.classList.toggle("hidden");
}
</script>
