<template>
  <li class="node">
    <button
      :class="{ selected: isSelected }"
      class="primaryButton"
      @click="selectNode(props.node)"
      @dblclick="toggleGroup"
    >
      <div class="flex items-center w-full">
        <div
          ref="icon"
          :class="
            isGroup ? 'i-carbon-caret-down' : 'i-carbon-text-short-paragraph'
          "
          class="flex-shrink-0"
        ></div>
        <input
          maxlength="30"
          @keydown.enter.esc="($event.target as HTMLInputElement).blur()"
          @click="selectNode(props.node)"
          v-model.lazy="nodeName"
          :style="isSelected ? 'width: 100%' : `width: ${nodeName.length}ch`"
          :class="{ 'text-dark-900': isSelected }"
          class="name"
        />
      </div>
      <p
        v-if="props.node.reference"
        :class="{
          'opacity-0': !isSelected,
        }"
        class="reference"
      >
        {{ props.node.reference }}
      </p>
    </button>
    <ul ref="nested" v-if="isGroup && node.children">
      <Node
        v-for="child in node.children"
        :node="child"
        @keydown.delete="deleteSelectedNode"
        @contextmenu.prevent="
          useContextMenu().open($event, [
            {
              label: 'Delete',
              action: () => {
                deleteSelectedNode();
              },
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

    .name {
      @apply p-0 border-none;
      @apply text-sm text-nowrap;
    }

    .reference {
      @apply italic text-dark-900 mx-2;
      @apply transition-opacity;
    }

    &:hover {
      .name {
        @apply text-dark-900;
      }

      .reference {
        @apply opacity-100;
      }
    }
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

const { deleteSelectedNode, updateNode } = useDeckStore();
const { selectedNode } = storeToRefs(useDeckStore());

const props = defineProps<{
  node: Tree;
}>();

const nodeName = computed({
  get() {
    return props.node.name;
  },
  set(value) {
    if (value.length > 30 || !value.length) return props.node.name;

    updateNode({
      ...props.node,
      name: value,
    });
  },
});

const isSelected = computed(() => {
  return selectedNode.value === props.node;
});
const isGroup = computed(() => {
  return props.node.type === "group";
});

const icon = ref<HTMLDivElement>();
const nested = ref<HTMLUListElement>();

function selectNode(node: Tree) {
  selectedNode.value = node;
}

function toggleGroup() {
  if (!isGroup.value) return;

  icon.value?.classList.toggle("-rotate-90");
  nested.value?.classList.toggle("hidden");
}

useSortable(nested, [], {
  animation: "200",
  easing: "cubic-bezier(1, 0, 0, 1)",
});
</script>
