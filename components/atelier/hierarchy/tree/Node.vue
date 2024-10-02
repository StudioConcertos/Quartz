<template>
  <li class="node">
    <button
      :class="{ selected: selectedNode === $el }"
      class="primaryButton"
      @click="toggleNode"
      @dblclick="toggleGroup"
      @contextmenu.prevent="
        useContextMenu().open($event, [
          {
            label: 'Rename',
            action: () => {},
          },
        ])
      "
      @keydown.delete="deckStore.deleteSelectedNode()"
    >
      <div class="flex items-center pointer-events-none">
        <div
          ref="icon"
          :class="
            isGroup ? 'i-carbon-caret-down' : 'i-carbon-text-short-paragraph'
          "
        ></div>
        <p class="text-nowrap">
          {{ props.node.name }}
        </p>
      </div>
      <p
        v-if="props.node.reference"
        :class="{
          'opacity-0': selectedNode !== $el,
        }"
        class="reference"
      >
        {{ props.node.reference }}
      </p>
    </button>
    <ul ref="nested" v-if="isGroup && node.children">
      <AtelierHierarchyTreeNode
        v-for="child in node.children"
        :data-path="child.path"
        :data-type="child.type"
        :node="child"
        @contextmenu.prevent="
          useContextMenu().open($event, [
            {
              label: 'Rename',
              action: () => {},
            },
            {
              label: 'Delete',
              action: () => deckStore.deleteSelectedNode(),
            },
          ])
        "
      />
    </ul>
  </li>
</template>

<style scoped lang="postcss">
.node {
  button {
    @apply px-2 mb-2 justify-between;
    @apply w-full border-none pointer-events-auto;

    div p,
    [class*="i-"] {
      @apply pointer-events-none;
    }

    div [class*="i-"] {
      @apply text-xl mr-2;
    }

    .reference {
      @apply italic text-dark-900 mr-2;
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
  @apply bg-light-200 text-dark-900;
}
</style>

<script setup lang="ts">
import { useSortable } from "@vueuse/integrations/useSortable";

const deckStore = useDeckStore();
const { selectedNode } = storeToRefs(useDeckStore());

const props = defineProps({
  node: {
    type: Object as PropType<Tree>,
    required: true,
  },
});

const isGroup = computed(() => {
  return props.node.type === "group";
});

const icon = ref<HTMLDivElement>();
const nested = ref<HTMLUListElement>();

useSortable(nested, [], {
  animation: "200",
  easing: "cubic-bezier(1, 0, 0, 1)",
});

function toggleNode(event: Event) {
  const node = event.target as HTMLButtonElement;

  selectedNode.value = node.parentElement as HTMLLIElement;
}

function toggleGroup() {
  if (!isGroup) return;

  icon.value?.classList.toggle("-rotate-90");
  nested.value?.classList.toggle("hidden");
}
</script>
